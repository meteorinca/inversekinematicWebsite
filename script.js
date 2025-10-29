let chain = null;
let canvas = null;

const segmentLengths = [150, 125, 105, 85, 70];
const iterations = 7;
const idleAnchor = { x: 0, y: 0 };
const pointer = { x: 0, y: 0, inside: false };
const smoothedTarget = { x: 0, y: 0 };
const trail = [];
const trailLength = 48;
let wiggleSeed = 0;
const disableSketch = (() => {
  if (typeof window === "undefined") {
    return false;
  }

  const width =
    window.innerWidth ||
    (document.documentElement ? document.documentElement.clientWidth : 0) ||
    0;

  const hasMatchMedia = typeof window.matchMedia === "function";
  const coarse = hasMatchMedia && window.matchMedia("(pointer: coarse)").matches;
  const fineHover = hasMatchMedia && window.matchMedia("(hover: hover)").matches;

  const ua =
    (typeof navigator !== "undefined" && navigator.userAgent) ? navigator.userAgent : "";
  const mobileUA = /Mobi|Android|iP(ad|hone|od)|Tablet|Mobile|Windows Phone|webOS/i.test(ua);

  if (mobileUA) {
    return true;
  }

  if (coarse && !fineHover && width <= 1024) {
    return true;
  }

  return false;
})();

class Bone {
  constructor(x, y, angle, length, child) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.child = child;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    const primaryStroke = color(78, 197, 255, 220);
    const secondaryStroke = color(160, 233, 255, 140);
    const jitter = (noise(frameCount * 0.025 + this.length) - 0.5) * 3.2;
    const jitterTail = (noise(frameCount * 0.025 + this.length + 200) - 0.5) * 3.2;

    strokeCap(ROUND);
    strokeJoin(ROUND);

    strokeWeight(max(this.length / 14, 4));
    stroke(primaryStroke);
    line(0, jitter * 0.3, this.length, jitterTail * 0.3);

    strokeWeight(max(this.length / 18, 2.8));
    stroke(secondaryStroke);
    line(0, jitter * -0.4, this.length, jitterTail * -0.25);

    const glowPulse = (sin(frameCount * 0.08 + this.length) + 1) * 0.45 + 0.75;
    noStroke();
    fill(82, 197, 255, 180);
    circle(0, 0, (this.length / 3.4) * glowPulse);

    if (this.child) {
      this.child.draw();
    } else {
      drawEndEffector(this.length);
    }

    pop();
  }

  updateIK(target) {
    const localTarget = rotatePoint(translatePoint(target, -this.x, -this.y), -this.angle);

    let endPoint;
    if (this.child) {
      endPoint = this.child.updateIK(localTarget);
    } else {
      endPoint = [this.length, 0];
    }

    const shiftAngle = angle(localTarget) - angle(endPoint);
    this.angle += shiftAngle;

    return translatePoint(rotatePoint(endPoint, this.angle), this.x, this.y);
  }
}

function setup() {
  if (disableSketch) {
    const container = canvasContainer();
    if (container) {
      container.classList.add("is-static");
    }
    noLoop();
    return;
  }

  canvas = createResponsiveCanvas();
  if (!canvas) {
    return;
  }

  wiggleSeed = random(1000, 9999);
  initializeChain();
  relaxChain(true);
  syncPointerDefaults();

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerdown", handlePointerMove, { passive: true });
  window.addEventListener("pointerup", handlePointerMove, { passive: true });
  window.addEventListener("pointercancel", handlePointerLeave, { passive: true });

  canvas.elt.addEventListener("pointerenter", () => {
    pointer.inside = true;
  });
  canvas.elt.addEventListener("pointerleave", handlePointerLeave);
}

function draw() {
  if (disableSketch || !chain) {
    return;
  }

  clear();
  drawBackdrop();

  const livelyTarget = updateLivelyTarget();
  updateTrail(livelyTarget);
  drawTrail();

  pointChainTowards([livelyTarget.x, livelyTarget.y]);
  chain.draw();

  drawAmbientGlow(livelyTarget);
  drawTargetMarker(livelyTarget);
}

function windowResized() {
  if (disableSketch) {
    return;
  }

  resizeSketch();
  initializeChain();
  relaxChain(true);
  syncPointerDefaults();
}

function handlePointerMove(event) {
  if (!canvas) {
    return;
  }

  const rect = canvas.elt.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
  pointer.inside =
    pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height;
}

function handlePointerLeave() {
  pointer.inside = false;
}

function touchMoved() {
  return true;
}

function syncPointerDefaults() {
  pointer.x = width * 0.7;
  pointer.y = height * 0.3;
  pointer.inside = false;
  smoothedTarget.x = pointer.x;
  smoothedTarget.y = pointer.y;
}

function initializeChain() {
  const rootX = width * 0.16;
  const rootY = height * 0.78;
  chain = buildChain(rootX, rootY, segmentLengths);

  idleAnchor.x = width * 0.64;
  idleAnchor.y = height * 0.36;
}

function buildChain(rootX, rootY, lengths) {
  let child = null;
  for (let i = lengths.length - 1; i >= 0; i--) {
    const length = lengths[i];
    const x = i === 0 ? rootX : lengths[i - 1];
    const y = i === 0 ? rootY : 0;
    child = new Bone(x, y, 0, length, child);
  }
  return child;
}

function pointChainTowards(target) {
  for (let i = 0; i < iterations; i++) {
    chain.updateIK(target);
  }
}

function relaxChain(initial = false) {
  const fallbackTarget = initial
    ? [idleAnchor.x, idleAnchor.y]
    : [smoothedTarget.x, smoothedTarget.y];
  pointChainTowards(fallbackTarget);
}

function updateLivelyTarget() {
  const margin = Math.max(width, height) * 0.3;
  const clampedX = constrain(pointer.x, -margin, width + margin);
  const clampedY = constrain(pointer.y, -margin, height + margin);
  const reachMix = pointer.inside ? 1 : 0.55;
  const desiredX = lerp(idleAnchor.x, clampedX, reachMix);
  const desiredY = lerp(idleAnchor.y, clampedY, reachMix);
  const followSpeed = pointer.inside ? 0.24 : 0.12;

  smoothedTarget.x = lerp(smoothedTarget.x, desiredX, followSpeed);
  smoothedTarget.y = lerp(smoothedTarget.y, desiredY, followSpeed);

  const wiggleAmplitude = pointer.inside ? 5 : 9;
  const wobbleX = Math.cos(frameCount * 0.045 + wiggleSeed) * wiggleAmplitude;
  const wobbleY = Math.sin(frameCount * 0.038 + wiggleSeed) * wiggleAmplitude * 0.7;
  const jitterX = (noise(frameCount * 0.012, wiggleSeed) - 0.5) * 6;
  const jitterY = (noise(frameCount * 0.017, wiggleSeed + 100) - 0.5) * 8;

  return {
    x: smoothedTarget.x + wobbleX + jitterX,
    y: smoothedTarget.y + wobbleY + jitterY,
  };
}

function updateTrail(target) {
  trail.push({
    x: target.x,
    y: target.y,
    born: frameCount,
  });

  if (trail.length > trailLength) {
    trail.shift();
  }
}

function drawTrail() {
  if (trail.length < 2) {
    return;
  }

  push();
  noFill();
  strokeCap(ROUND);

  for (let i = 1; i < trail.length; i++) {
    const prev = trail[i - 1];
    const curr = trail[i];
    const t = i / trail.length;

    const alpha = map(t, 0, 1, 20, 90);
    const weight = map(t, 0, 1, 6, 1.2);

    stroke(78, 197, 255, alpha);
    strokeWeight(weight);
    line(prev.x, prev.y, curr.x, curr.y);
  }

  for (let i = 1; i < trail.length; i += 3) {
    const node = trail[i];
    const tailAlpha = map(i, 1, trail.length, 80, 10);
    stroke(140, 210, 255, tailAlpha);
    strokeWeight(1.2);
    const radius = map(i, 1, trail.length, 26, 8);
    arc(node.x, node.y, radius, radius, -PI * 0.2, PI * 0.6);
  }

  pop();
}

function drawBackdrop() {
  push();
  noStroke();

  for (let i = 10; i >= 0; i--) {
    const ratio = i / 10;
    const col = lerpColor(color(4, 16, 46, 0), color(24, 160, 255, 60), ratio);
    fill(col);
    circle(width * 0.8, height * 0.18, width * ratio * 1.4);
  }

  stroke(30, 80, 140, 40);
  strokeWeight(1);
  const gridSize = 80;
  for (let x = -gridSize; x < width + gridSize; x += gridSize) {
    line(x, 0, x + gridSize * 0.25, height);
  }
  for (let y = gridSize * -1; y < height + gridSize; y += gridSize) {
    line(0, y, width, y + gridSize * 0.18);
  }

  pop();
}

function drawAmbientGlow(target) {
  push();
  noFill();
  strokeWeight(1.4);

  for (let i = 0; i < 4; i++) {
    const radius = 90 + i * 32;
    const alpha = map(i, 0, 3, 80, 15);
    stroke(90, 210, 255, alpha);
    ellipse(target.x, target.y, radius, radius * 0.82);
  }

  pop();
}

function drawTargetMarker(target) {
  push();
  stroke(188, 226, 255, 140);
  strokeWeight(1.6);
  noFill();
  circle(target.x, target.y, 22);
  line(target.x - 12, target.y, target.x + 12, target.y);
  line(target.x, target.y - 12, target.x, target.y + 12);
  pop();
}

function drawEndEffector(length) {
  const tipPulse = (sin(frameCount * 0.12) + 1) * 0.5 + 0.75;

  const tipX = length;
  const tipY = 0;

  fill(176, 232, 255, 220);
  circle(tipX, tipY, (length / 2.4) * tipPulse);

  stroke(212, 244, 255, 160);
  strokeWeight(1.4);
  noFill();
  arc(tipX, tipY, length / 1.3, length / 2.5, -PI * 0.2, PI * 0.4);
}

function resizeSketch() {
  const { width: newWidth, height: newHeight } = canvasSizeFromContainer();
  resizeCanvas(newWidth, newHeight);
}

function createResponsiveCanvas() {
  const { width: canvasWidth, height: canvasHeight } = canvasSizeFromContainer();
  if (canvasWidth === 0 || canvasHeight === 0) {
    return null;
  }
  const sketchCanvas = createCanvas(canvasWidth, canvasHeight);
  const container = canvasContainer();
  if (container) {
    sketchCanvas.parent(container);
  }
  return sketchCanvas;
}

function canvasContainer() {
  if (window.createCanvasParent instanceof HTMLElement) {
    return window.createCanvasParent;
  }
  return document.getElementById("playground") || document.getElementById("ik-canvas");
}

function canvasSizeFromContainer() {
  const container = canvasContainer();
  if (!container) {
    return { width: 0, height: 0 };
  }
  const bounds = container.getBoundingClientRect();
  const rawWidth = bounds.width > 0 ? bounds.width : 560;
  const clampedWidth = constrain(rawWidth, 320, 940);
  const height = Math.max(Math.round(clampedWidth * 0.68), 300);
  return { width: clampedWidth, height };
}

function rotatePoint(point, theta) {
  const [x, y] = point;
  return [
    x * Math.cos(theta) - y * Math.sin(theta),
    x * Math.sin(theta) + y * Math.cos(theta),
  ];
}

function translatePoint(point, h, v) {
  const [x, y] = point;
  return [x + h, y + v];
}

function angle(point) {
  const [x, y] = point;
  return Math.atan2(y, x);
}

let chain = null;
let canvas = null;
const segmentLengths = [130, 110, 90, 70];
const iterations = 6;
const idleTarget = { x: 0, y: 0 };

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

    strokeWeight(max(this.length / 10, 6));
    stroke(56, 189, 248);
    line(0, 0, this.length, 0);

    fill(14, 116, 144);
    noStroke();
    circle(0, 0, this.length / 4);

    if (this.child) {
      this.child.draw();
    } else {
      fill(56, 189, 248);
      circle(this.length, 0, this.length / 3);
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
  canvas = createResponsiveCanvas();
  initializeChain();
  relaxChain();
}

function draw() {
  clear();
  drawBackdrop();

  const target = pointerInsideCanvas() ? [mouseX, mouseY] : [idleTarget.x, idleTarget.y];
  pointChainTowards(target);
  chain.draw();

  drawTargetMarker(target);
}

function windowResized() {
  resizeSketch();
  initializeChain();
  relaxChain();
}

function touchMoved() {
  return false;
}

function initializeChain() {
  const rootX = width * 0.25;
  const rootY = height * 0.7;
  chain = buildChain(rootX, rootY, segmentLengths);

  idleTarget.x = width * 0.72;
  idleTarget.y = height * 0.35;
}

function buildChain(rootX, rootY, lengths) {
  let current = null;
  for (let i = lengths.length - 1; i >= 0; i--) {
    const length = lengths[i];
    const x = i === 0 ? rootX : lengths[i - 1];
    const y = i === 0 ? rootY : 0;
    current = new Bone(x, y, 0, length, current);
  }
  return current;
}

function pointChainTowards(target) {
  for (let i = 0; i < iterations; i++) {
    chain.updateIK(target);
  }
}

function relaxChain() {
  pointChainTowards([idleTarget.x, idleTarget.y]);
}

function pointerInsideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function drawBackdrop() {
  push();
  const gradientSteps = 12;
  noStroke();

  for (let i = gradientSteps; i >= 0; i--) {
    const ratio = i / gradientSteps;
    const col = lerpColor(color(15, 23, 42), color(0, 176, 255, 40), ratio);
    fill(col);
    circle(width * 0.8, height * 0.2, width * ratio);
  }

  pop();
}

function drawTargetMarker([x, y]) {
  push();
  stroke(148, 163, 184, 150);
  strokeWeight(1.5);
  noFill();
  circle(x, y, 18);
  line(x - 10, y, x + 10, y);
  line(x, y - 10, x, y + 10);
  pop();
}

function resizeSketch() {
  const { width: newWidth, height: newHeight } = canvasSizeFromContainer();
  resizeCanvas(newWidth, newHeight);
}

function createResponsiveCanvas() {
  const { width: canvasWidth, height: canvasHeight } = canvasSizeFromContainer();
  const sketchCanvas = createCanvas(canvasWidth, canvasHeight);
  sketchCanvas.parent("ik-canvas");
  return sketchCanvas;
}

function canvasSizeFromContainer() {
  const container = document.getElementById("ik-canvas");
  const bounds = container.getBoundingClientRect();
  const width = bounds.width > 0 ? bounds.width : 560;
  const clampedWidth = constrain(width, 320, 720);
  const height = Math.max(Math.round(clampedWidth * 0.6), 260);
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

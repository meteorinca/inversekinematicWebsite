# Starbase Academy STEM Playground

NASA engineer turned educator, building Starbase Academy to make science real, tactile, and fun. This landing page blends a kinetic p5.js demo with story-driven content, nine feature tiles, and a responsive resource grid to highlight hands-on STEM initiatives.

## Highlights

- Space-themed starfield, blueprint grid overlay, and rim-lit hero panel to ground the Starbase Academy identity.
- Sketch-style inverse-kinematics arm with jittered strokes, kinetic glow, and trailing motion arcs that keeps reaching toward your pointer even off-canvas.
- Floating micro-bot mascot, glowing CTA ripple, and hover states that add playful professionalism without overwhelming the layout.
- Numbered mission cards with CTA badges, hover nuance, and responsive stacking for storytelling-first presentation.
- Touch devices auto-disable the interactive arm and show an elegant fallback so scrolling stays buttery smooth on mobile.
- Tools and links section rendered as mobile-friendly cards plus updated contact footer messaging for the Starbase Academy brand.

## Getting started

1. Open `index.html` in a modern browser.
2. Move the mouse or drag a finger around the page; the arm will stretch toward the pointer (even beyond the canvas) while keeping page scrolling smooth on touch devices.
3. Explore the project and resource cards to adapt them for your own programs, kits, or community outreach.

## Project structure

- `index.html` &mdash; Page layout, mission copy, feature grid, and external resource cards.
- `styles.css` &mdash; Dark-theme design system, responsive layout rules, and interaction states for cards and buttons.
- `script.js` &mdash; p5.js sketch powering the articulated arm, pointer tracking outside the canvas, and playful motion jitter.

### Customizing

- Swap project titles, descriptions, tags, and links directly within `index.html`.
- Adjust starfield, color tokens, spacing, or card radii in the root variables at the top of `styles.css`.
- Tweak the arm behavior (segment lengths, wobble amplitude, easing) in `script.js` to fit your preferred vibe.

## Firebase hosting

1. Install the Firebase CLI if you have not already: `npm install -g firebase-tools`.
2. Log in once from your terminal: `firebase login`.
3. Deploy the site to the existing Hosting target: `firebase deploy --only hosting --project stemblog`.

The configuration files (`firebase.json`, `.firebaserc`) are already set up to publish the current directory while ignoring config and markdown files.

Enjoy iterating on the playground and tailoring it for upcoming launches at Starbase Academy.

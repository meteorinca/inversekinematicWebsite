# Starbase Academy STEM Playground

NASA engineer turned educator, building Starbase Academy to make science real, tactile, and fun. This landing page blends a kinetic p5.js demo with story-driven content, nine feature tiles, and a responsive resource grid to highlight hands-on STEM initiatives.

## Highlights

| Area      | Callouts                                                                                                      |
|-----------|---------------------------------------------------------------------------------------------------------------|
| Hero      | Space-inspired gradients, blueprint grid overlay, animated starfield, floating micro-bot, dual CTA buttons.   |
| Sketch    | Inverse-kinematics arm rendered in p5.js with jittered “ink” strokes, glow pulses, trails, and idle motion.   |
| Mobile    | Touch devices receive a static fallback message so scroll feels natural; desktop keeps the live interaction.  |
| Projects  | Numbered mission cards with status badges, hover elevation, and quick-to-scan tag chips for each initiative.  |
| Resources | External link tiles and contact CTA styled for both desktop and mobile readability.                           |

### Stack at a glance

- **HTML5** single-page layout with semantic sections: hero, mission, story, projects, resources, contact.
- **CSS** (custom properties, grid, flex) for theming, responsive layout, and animation keyframes.
- **p5.js** sketch (`script.js`) for the inverse-kinematics arm and visual flourishes.
- **Firebase Hosting** for CDN delivery and simple CLI-based deployment.

For deeper context before building new features, refer to:

- `docs/STACK.md` — Architecture, tooling, and deployment reminders.
- `docs/FEATURES.md` — Feature inventory, behavior notes, and responsiveness overview.

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
- Review the `docs` folder (especially `docs/STACK.md` and `docs/FEATURES.md`) to stay aligned with current conventions.

## Firebase hosting

1. Install the Firebase CLI if you have not already: `npm install -g firebase-tools`.
2. Log in once from your terminal: `firebase login`.
3. Deploy the site to the existing Hosting target: `firebase deploy --only hosting --project stemblog`.

The configuration files (`firebase.json`, `.firebaserc`) are already set up to publish the current directory while ignoring config and markdown files.

Enjoy iterating on the playground and tailoring it for upcoming launches at Starbase Academy.

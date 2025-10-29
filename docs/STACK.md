# Stack & Architecture

## Overview

The Starbase Academy landing experience is a static client-side application with a single-page structure. The stack focuses on fast iteration, easy deployment, and a smooth offline-friendly workflow.

| Layer                | Choice                          | Purpose                                                                 |
|----------------------|---------------------------------|-------------------------------------------------------------------------|
| Markup               | HTML5                           | Semantic layout for hero, mission cards, and resources.                |
| Styling              | Vanilla CSS (custom properties) | Theming, responsive layout, and animation control without preprocessors. |
| Interactivity        | p5.js                           | Real-time inverse-kinematics arm and animated visual flourishes.       |
| Hosting              | Firebase Hosting                | Global CDN with SSL, versioning, and simple CLI-based deploys.         |

## Page Structure

- `index.html` contains the full markup in the following order:
  1. Hero section with CTA buttons and the animated arm container.
  2. Mission trio (Learn by Doing, Build a Tribe, Make Engineering Human).
  3. Founder story paragraphs.
  4. Featured Projects — a numbered mission list with status badges.
  5. Tools & External Links — quick-access resource cards.
  6. Contact CTA and footer.
- `styles.css` drives the theme, including:
  - Space-inspired background (radial gradients, animated starfield, blueprint grid overlay).
  - Responsive layout using CSS Grid and Flexbox.
  - Component-level hover states and animation keyframes.
  - Canvas fallback styling when interactivity is disabled on touch devices.
- `script.js` bootstraps the p5.js sketch:
  - Detects device type and suppresses the sketch on touch-heavy environments.
  - Builds the inverse-kinematics chain and renders jittered “ink” strokes with trails.
  - Responds to pointer moves and updates the hero visuals per frame.

## Firebase Hosting

- `.firebaserc` pins the default project (`stemblog`).
- `firebase.json` maps hosting to serve the project root, ignoring dev-only files.
- Deployments use `firebase deploy --only hosting --project stemblog`.

## Local Development Tips

- Serve files with any static server (e.g. `npx serve .` or VS Code Live Server) to avoid CORS quirks.
- Keep p5 sketch edits inside `script.js`; the layout does not rely on any bundler.
- For mobile testing, use browser device emulation and real-device reloads to confirm the fallback behavior.

## Future Enhancements

- Integrate a build step if componentization is needed (e.g. Vite/Svelte/React) but keep the current structure for quick edits.
- Layer in analytics or form handling by dropping in the necessary scripts within `index.html`.
- Consider modularizing CSS with partials if the stylesheet grows beyond this single page.

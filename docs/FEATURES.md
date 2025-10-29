# Features & Behaviors

## Hero Experience

- **Starfield + Blueprint Background:** Animated gradients and grid lines establish a space-engineering vibe immediately.
- **Interactive Arm (Desktop):** A five-segment inverse-kinematics chain follows the cursor with hand-drawn jitter, glow, and motion trails.
- **Touch Fallback (Mobile):** Touch-intensive devices see a static hero with messaging so scrolling remains smooth.
- **Micro-Bot Mascot:** A floating bot with blinking eyes and antenna adds character above the hero canvas.
- **Call-to-Action Buttons:** Gradient primary and outlined secondary buttons include glowing hover ripples.

## Mission & Story

- Three mission cards (Learn by Doing, Build a Tribe, Make Engineering Human) describe the education philosophy.
- Supporting paragraphs explain the founder’s belief in accessible STEM for all backgrounds.

## Featured Projects

- Six numbered mission cards highlight key initiatives (TestTaker, PersonalSocrates.org, Starbase Academy, LeRobot Trainer, Math in Motion, STEM Outreach Jamaica).
- Each card features a status badge (“Coming Soon”, “Visit”, “Learn More”, “Try It”) and keyword tags.
- Hover effects lift the cards and reveal subtle radial highlights.

## Tools & External Links

- Quick link cards for GitHub, YouTube, Blog, Kits, and Contact.
- Each card has hover motion and accent underlines for clearer affordances.

## Contact & Footer

- A simple call-to-action invites collaboration via email.
- Footer reinforces Starbase Academy’s mission statement.

## Responsive Behavior

- Layout scales up to ~1180px width; cards collapse to single-column stacks on narrow viewports.
- Buttons switch to full-width on small screens.
- Hero fallback text only appears when the p5 sketch is disabled.

## Animations

- Global aurora-style background drift and slow starfield pan.
- Hero canvas pulses, arm segments jitter, and trails curve using p5 frame-based updates.
- Buttons, mission cards, project cards, and link tiles have hover/focus elevation.

## Deployment Notes

- No build tooling required; Firebase Hosting serves the static assets.
- `firebase deploy --only hosting --project stemblog` publishes the latest version.

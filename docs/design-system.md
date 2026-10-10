# Design system

## Direction

Midnight ink, electric lime, and mist form a restrained spatial editorial identity. The visual weight comes from typography, asymmetry, layered project maps, clear content hierarchy, and one persistent procedural WebGL material. The page is not a fake operating system or a collection of dashboard cards.

## Composition

- Use a fluid page gutter and a 1520px outer measure.
- Keep the hero asymmetric, with readable DOM content at the left and the procedural object behind it.
- Give the two lead projects large, alternating compositions. Keep additional projects compact.
- Use one column for dense mobile content and retain a clear reading order.
- Keep the shared Canvas behind all page content and mark it `aria-hidden`.

## Interaction and motion

- Use native anchors, lists, and disclosure elements for page navigation and project details.
- The client side header tracks the section at the reading line with `IntersectionObserver`.
- GSAP animates section headings and coordinates project map focus. R3F owns scene motion and advances Lenis.
- Respect `prefers-reduced-motion`; do not require animation to reveal content or use controls.
- If WebGL is unavailable, the DOM layout and CSS fallback remain useful.

## Content and architecture

- Keep project facts in `lib/content.ts`.
- Build architecture visualizations from documented nodes and edges.
- Show project status in text and do not present development work as completed production software.
- Keep server rendered content in the App Router page component; use Client Components only for browser interaction.

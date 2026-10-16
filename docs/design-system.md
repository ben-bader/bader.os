# Design system

## Direction

The portfolio uses a dark graphite canvas, lime accent, Poppins body text, and Manrope display type. Asymmetric editorial layouts, fine borders, project system maps, and the procedural WebGL B provide visual identity. Preserve this direction across routes.

## Composition

- Use the existing fluid page gutter and 1520px maximum width.
- Keep the hero asymmetric with readable DOM content and the 3D object behind it.
- Keep the two featured projects prominent and supporting work compact.
- Collapse dense layouts to one column on narrow screens without changing content order.
- Keep the shared canvas behind page content and hidden from assistive technology.

## Interaction and motion

- Use native anchors, links, lists, disclosure elements, and semantic headings.
- `ConstellationNav` tracks section positions with intersection/resize observers and scroll scheduling.
- GSAP animates section headings and project focus; R3F owns scene motion and advances Lenis.
- Respect reduced motion and retain useful fallback content when WebGL is unavailable.
- Preserve keyboard focus visibility, skip navigation, and touch-sized interactive targets.

## Styling boundaries

- Tailwind CSS 4 utilities own component layout, spacing, typography, colors, borders, and responsive behavior. The `@theme inline` block in `app/globals.css` is the source for semantic color, font, spacing, radius, shadow, z-index, duration, and breakpoint utilities.
- Keep the single global stylesheet for the Tailwind entry point, theme aliases, browser resets, global font and focus rules, and Lenis integration.
- Keep the fixed R3F canvas and its CSS fallback in CSS because they are rendering-layer effects behind the page.
- Keep the constellation SVG stroke, hover tooltip pseudo-element, and label animation in CSS because they style SVG drawing and a generated pseudo-element.
- Keep the hero orbital illustration, project preview gradients and watermark, and About section gradient in CSS because their layered gradients, pseudo-elements, and orbit transforms define the existing artwork.
- Keep KnowledgeGraph SVG stroke, node state, animated wire drawing, and reduced-motion override in CSS because these styles control interactive SVG geometry and animation state.
- Keep the Journey connector line in CSS because it is a positioned pseudo-element between timeline entries.

## Content and architecture

- Keep project display facts in `data/projects/*.ts`.
- Keep node-and-edge topology in `lib/project-architecture.ts` and reference catalog IDs only.
- Keep education, internship, identity, and chronology content in `lib/content.ts`.
- Keep route composition and static presentation server-rendered. Use Client Components only for browser APIs, state, and animation lifecycles.

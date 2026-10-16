@AGENTS.md

# Project guidance

This is a Next.js App Router portfolio with React 19, TypeScript, Tailwind CSS 4, GSAP, Three.js, React Three Fiber, Drei, Lenis, and Lucide React.

## Architecture

- Keep project display facts in `data/projects/*.ts` and graph topology in `lib/project-architecture.ts`.
- Keep route pages and ordinary presentation as Server Components. Add `use client` only for state, effects, browser APIs, or animation lifecycle needs.
- The active homepage is composed from section modules under `components/portfolio/sections/`.
- Preserve the active constellation navigation and the experience runtime in `components/experience/`.
- The active interactive technology graph is `components/visualizations/KnowledgeGraph.tsx`, mounted by the portfolio Capabilities section. Retired OS and visualization experiments were removed after the repository-reference audit.

## Styling

- Tailwind CSS 4 is already installed. Keep the existing PostCSS plugin and CSS-first `@theme inline` setup; do not add Tailwind v3 configuration.
- Reuse the CSS variables in `app/globals.css` through semantic theme aliases.
- Use utilities for routine layout and retain scoped CSS for orbital art, constellation geometry, WebGL, and GSAP-controlled states.
- Keep the existing dark graphite/lime palette, Poppins body face, and Manrope display face.
- Prefer classes over inline styles. Use dynamic inline values only where coordinates or runtime animation data require them.
- No shadcn/ui component package is installed; do not describe the project as using it.

## Quality

- Preserve semantic HTML, keyboard access, visible focus, reduced-motion support, responsive behavior, and the existing visual identity.
- Never invent project features, deployments, metrics, or responsibilities.
- Run `npm run lint` and `npx tsc --noEmit --incremental false` after meaningful changes. Use the installed Next.js documentation in `node_modules/next/dist/docs/` before changing Next APIs.

# Architecture

## Route and rendering

- `app/page.tsx` is the App Router entry point. It renders `components/portfolio/PortfolioPage.tsx` as a Server Component.
- `PortfolioPage` renders identity, project content, biography, skills, chronology, and contact in semantic HTML.
- `components/portfolio/SiteHeader.tsx` is a small Client Component. It uses `IntersectionObserver` to expose the current section in the sticky navigation.
- `app/layout.tsx` defines metadata, viewport colors, structured person data, the skip link, and the optional experience runtime.

## Experience runtime

- `components/experience/ExperienceRuntime.tsx` detects capability and dynamically loads the React Three Fiber Canvas and GSAP orchestration.
- `ExperienceCanvas.tsx` renders the procedural glass loop, restrained particles, and a project graph built from `projectSystems` nodes and edges.
- `HeroMaterial.ts` contains the glass and screen-refraction material definitions.
- `ScrollBus`, `PointerBus`, and `ProjectFocusBus` hold the shared scroll, pointer, and selected-project state.
- `MotionOrchestrator.tsx` coordinates heading entrance and project focus; R3F advances Lenis in its frame bridge.

## Source of truth

Portfolio facts are in `lib/content.ts`. Architecture visuals consume the recorded project relationships. Do not add implied edges or substitute generated project screenshots.

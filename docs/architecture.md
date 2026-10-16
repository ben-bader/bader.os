# Architecture

## Routes and rendering

- `/` is an App Router Server Component entry that composes the homepage sections in `components/portfolio/PortfolioPage.tsx`.
- `/projects` renders the archive from `data/projects/index.ts`.
- `/projects/[id]` generates one detail route per catalog ID and uses the existing not-found path for invalid IDs.
- The root layout owns metadata, the Poppins and Manrope `next/font` setup, global CSS, the skip link, and `ExperienceRuntime`.
- Static content and route composition remain Server Components. `ConstellationNav` uses client state, observers, and animation frames for the active section label.

## Component organization

- `components/portfolio/sections/` contains the hero, featured work, about, capabilities, journey, contact, and footer sections.
- `SectionIntro` and `SystemMap` are shared homepage presentation components.
- `components/projects/` contains archive cards, detail composition, and image/placeholder preview.
- `components/experience/` owns capability detection, the React Three Fiber scene, Three.js materials, GSAP/ScrollTrigger choreography, and shared interaction buses.

## Data ownership

- `data/projects/*.ts` is the canonical source for all project display content and links.
- `lib/project-architecture.ts` stores graph topology only. Each project ID and each edge endpoint is checked when the catalog loads.
- `lib/content.ts` owns identity, education, internships, and chronology. Its older `projectSystems` dataset remains for unrouted legacy components; active homepage and canvas components do not consume it.

## Styling and motion

- `app/globals.css` is the Tailwind CSS 4 entry point and defines the canonical CSS variables, `@theme inline` aliases, global base rules, and specialized site styling.
- Routine archive, preview, and project-detail layout uses Tailwind utilities. Named CSS remains for the constellation geometry, hero artwork, canvas stacking, and motion-specific selectors.
- GSAP continues to target `#main-content > section`, `.project-record`, and `.technical-flow`. Keep those hooks and CSS-managed transforms intact when changing layout.

## Unrouted legacy source

The active portfolio uses `components/visualizations/KnowledgeGraph.tsx` inside the Capabilities section. The unused OS experience and older visualization experiments were removed after confirming they had no route, app import, dynamic import, script, or configuration entry point.

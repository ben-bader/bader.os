# bader.os

A software engineering portfolio for Bader Bennani, computer engineering student at EILCO in Calais, France.

## Routes

- `/` presents the portfolio, selected project work, background, capabilities, journey, and contact details.
- `/projects` lists the project catalog.
- `/projects/[id]` renders statically generated project details from the same catalog.
- `app/not-found.tsx`, `app/loading.tsx`, `app/robots.ts`, `app/sitemap.ts`, and `app/icon.svg` provide App Router conventions and metadata routes.

## Architecture

- `data/projects/*.ts` is the canonical source for project titles, descriptions, technologies, status, links, images, features, and contributions.
- `lib/project-architecture.ts` contains only node-and-edge topology used by the homepage system maps and the 3D project focus scene. The catalog validates graph project IDs and edge endpoints.
- `lib/content.ts` holds identity, education, internship, and chronology content. It still contains the older `projectSystems` dataset for unrouted legacy source; active homepage and canvas components use the canonical catalog plus `lib/project-architecture.ts`.
- Homepage sections are server-rendered modules under `components/portfolio/sections/`. `ConstellationNav` owns client-side active-section behavior.
- `ExperienceRuntime` capability-checks in a client effect and loads the R3F canvas and GSAP orchestrator. The canvas includes the procedural 3D B, project focus, and Lenis frame bridge.
- Tailwind CSS 4 is configured through `@tailwindcss/postcss` and `@import "tailwindcss"` in `app/globals.css`. The CSS-first `@theme inline` block maps semantic utilities to the existing CSS variables.

## Project media

Project images are stored at the paths declared in each record's `images` array. Current media includes `public/images/projects/<slug>/image.png` and a small set of existing `/projects/*.png` assets. Projects without an image use the built-in preview placeholder. See `public/images/projects/README.md` before adding or replacing screenshots.

## Local checks

```sh
npm run dev
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

There is no test script or test framework configured in `package.json`.

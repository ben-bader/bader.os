# bader.os

A software engineering portfolio for Bader Bennani, computer engineering student at EILCO in Calais, France.

## Page structure

| Section | Content |
|---|---|
| Home | Identity, focus, selected actions |
| Selected work | AtlasHR and ONEE-SYS, followed by Innovex and Homely |
| About | Studies, location, languages, and engineering interests |
| Capabilities | Technologies grouped by the work they support |
| Journey | Education and internship chronology |
| Contact | Email, GitHub, LinkedIn, and résumé |

## Implementation

- Next.js App Router; the page and project information are server rendered.
- A small Client Component tracks the current section for the sticky navigation.
- The shared React Three Fiber canvas contains a procedural glass loop and can bring a selected project's documented architecture into focus.
- GSAP and ScrollTrigger animate section headings and project focus. R3F advances Lenis and reads the shared pointer and scroll state.
- Native anchors, project disclosures, focus styles, reduced-motion behavior, and a CSS fallback keep the content accessible when effects are unavailable.
- Midnight ink, mist, electric lime, a native system sans stack, and restrained system monospace are documented in `docs/design-tokens.md`.

## Content and assets

Project, education, internship, and technology facts live in `lib/content.ts`. Project relationship diagrams use the source nodes and edges. There are no project screenshots in `public/images/projects/`, so the portfolio uses original diagrams instead of invented product imagery.

## Local development

```sh
npm run dev
npm run lint
npm run build
```

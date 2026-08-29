# bader.os

> An engineering mind, made navigable.
> Not a portfolio. A living digital operating system.

## Concept

The experience is structured as 7 system layers rather than traditional portfolio sections.
Visitors navigate a system — they don't scroll through a resume.

| Layer | Codename     | Replaces        | Concept                                         |
|-------|-------------|----------------|-------------------------------------------------|
| 01    | CORE        | Hero            | Living system environment with node network     |
| 02    | MEMORY      | About           | Timeline fragments recovered from commit history |
| 03    | KNOWLEDGE   | Skills          | Interactive D3 force graph — tech relationships |
| 04    | SYSTEMS     | Projects        | Architecture diagrams with animated data flows  |
| 05    | PROCESS     | Workflow        | Engineering method visualised as a pipeline     |
| 06    | INTELLIGENCE| Values          | Dimensions scored with animated metric bars     |
| 07    | LEGACY      | Contact         | Quiet ending — links revealed after the journey |

## Stack

| Concern    | Technology                                         |
|------------|---------------------------------------------------|
| Framework  | Next.js 16 (App Router, Server Components)        |
| Language   | TypeScript (strict)                               |
| Styling    | Tailwind CSS v4 + CSS custom properties           |
| 3D         | Three.js · @react-three/fiber                     |
| Animation  | GSAP 3 (ScrollTrigger) · Framer Motion            |
| Data viz   | D3 (canvas-based force graph, SVG arch diagrams)  |
| Scroll     | Lenis smooth scroll                               |
| Analytics  | Vercel Analytics + Speed Insights                 |
| Deploy     | Vercel (static + ISR)                             |

## Architecture

```
system/
  layers.ts          ← Layer definitions (id, anchor, codename)
  events.ts          ← Ambient terminal event sequences

lib/
  content.ts         ← Single source of truth for ALL data
  utils.ts           ← Math helpers, easing functions

components/
  os/
    SystemOS.tsx     ← Root orchestrator (loads all layers + overlays)
    Cursor.tsx       ← Custom cursor (dot + lagged ring)
    SystemNavigator.tsx ← Floating mission-control dots (xl+)
    LayerCore.tsx    ← L01: Three.js node network + identity
    LayerMemory.tsx  ← L02: Timeline fragments by year
    LayerKnowledge.tsx ← L03: D3 canvas knowledge graph
    LayerSystems.tsx ← L04: SVG architecture diagrams (selectable)
    LayerProcess.tsx ← L05: Engineering pipeline with phase details
    LayerIntelligence.tsx ← L06: Animated metric bars + principles
    LayerLegacy.tsx  ← L07: Quiet ending with contact links

  three/
    SceneCore.tsx    ← Node network galaxy (Three.js)

  visualizations/
    KnowledgeGraph.tsx ← D3 canvas force-directed graph
    ArchDiagram.tsx    ← SVG architecture topology

  ui/
    OSLoader.tsx       ← Cinematic counter loader with clip-path exit
    CommandPalette.tsx ← ⌘K system navigator
    SystemTerminal.tsx ← Ambient terminal event stream
    ScrollProgress.tsx ← Gradient progress bar
    AmbientField.tsx   ← Canvas mouse-reactive gradient field
    KonamiEgg.tsx      ← Easter egg (↑↑↓↓←→←→BA)
    SkipLink.tsx       ← Accessible skip navigation

hooks/
  useInView.ts       ← IntersectionObserver hook
```

## Running

```bash
npm run dev     # http://localhost:3000
npm run build   # Production build
npm start       # Preview production
```

## Keyboard shortcuts

| Key        | Action                    |
|------------|--------------------------|
| `Ctrl/⌘ K` | Open command palette      |
| `↑↑↓↓←→←→BA` | Easter egg              |

## Content

All content lives in `lib/content.ts` — a single typed file.
Zero hardcoded strings in components.

# Graph Report - bader.os  (2026-10-07)

## Corpus Check
- Corpus is ~32,235 words - fits in a single context window. You may not need a graph.

## Summary
- 316 nodes · 506 edges · 18 communities (14 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- OS Interaction Layer
- Project Configuration
- Design Principles
- Architecture Visualizations
- Knowledge Graph UI
- Portfolio Content and Memory
- Intelligence Metrics
- Runtime Dependencies
- TypeScript Configuration
- Application Shell and Metadata
- Navigation and Commands
- Lighting Effects
- Development Tooling
- Interactive Tilt Cards
- System Terminal
- CSS Processing
- Resume Asset

## God Nodes (most connected - your core abstractions)
1. `react` - 26 edges
2. `SystemOS()` - 19 edges
3. `compilerOptions` - 16 edges
4. `gsap` - 15 edges
5. `Frontend Engineering Standards` - 15 edges
6. `User Experience` - 10 edges
7. `KnowledgeNode` - 9 edges
8. `next` - 9 edges
9. `Design System` - 8 edges
10. `LayerCore()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `SystemOS()`  [EXTRACTED]
  app/page.tsx → components/os/SystemOS.tsx
- `TimelineRow()` --calls--> `useInView()`  [EXTRACTED]
  components/os/LayerMemory.tsx → hooks/useInView.ts
- `TimelineSpine()` --calls--> `useInView()`  [EXTRACTED]
  components/os/LayerMemory.tsx → hooks/useInView.ts
- `SystemNavigator()` --calls--> `scrollToId()`  [EXTRACTED]
  components/os/SystemNavigator.tsx → lib/lenis.ts
- `CommandPalette()` --calls--> `scrollToId()`  [EXTRACTED]
  components/ui/CommandPalette.tsx → lib/lenis.ts

## Import Cycles
- None detected.

## Communities (18 total, 4 thin omitted)

### Community 0 - "OS Interaction Layer"
Cohesion: 0.10
Nodes (27): HomePage(), LayerCore(), init(), LayerIntelligence(), init(), LayerLegacy(), init(), LINKS (+19 more)

### Community 1 - "Project Configuration"
Cohesion: 0.06
Nodes (31): eslintConfig, name, private, scripts, build, dev, lint, start (+23 more)

### Community 2 - "Design Principles"
Cohesion: 0.10
Nodes (26): Agents, Claude, Design System, Accessibility, Animation Guidelines, Architecture, Coding Style, Component Guidelines (+18 more)

### Community 3 - "Architecture Visualizations"
Cohesion: 0.09
Nodes (27): ArchDiagram(), computeLayeredPositions(), EDGE_STYLE, Props, STATUS_COLOR, AnimPacket(), ArchFlow(), buildFlow() (+19 more)

### Community 4 - "Knowledge Graph UI"
Cohesion: 0.12
Nodes (22): CATEGORY_COLORS, LayerKnowledge(), init(), SignalField, ActiveInfo, CATEGORY_COLOR, NodePos, CAT_AFFINITY (+14 more)

### Community 5 - "Portfolio Content and Memory"
Cohesion: 0.15
Nodes (18): LayerMemory(), ROW_MARGINS, rowMargin(), TimelineCard(), TimelineHeader(), TimelineRow(), TimelineSpine(), education (+10 more)

### Community 6 - "Intelligence Metrics"
Cohesion: 0.11
Nodes (9): MetricCard(), PRINCIPLES, OSLoader(), Options, useInView(), intelligenceMetrics, easeOutExpo(), clsx (+1 more)

### Community 7 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, clsx, d3, gsap, @gsap/react, lenis, lucide-react, motion (+12 more)

### Community 8 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Application Shell and Metadata"
Cohesion: 0.12
Nodes (8): bodyFont, display, metadata, RootLayout(), viewport, SkipLink(), nextConfig, next

### Community 10 - "Navigation and Commands"
Cohesion: 0.24
Nodes (8): SystemNavigator(), Cmd, CommandPalette(), LAYER_DESCS, LenisInstance, scrollToId(), Layer, LAYERS

### Community 11 - "Lighting Effects"
Cohesion: 0.24
Nodes (9): getAnchorAndDir(), hexToRgb(), LightRays(), LightRaysProps, RaysOrigin, Uniforms, Vec2, Vec3 (+1 more)

### Community 12 - "Development Tooling"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/d3, @types/node, @types/react (+2 more)

### Community 13 - "Interactive Tilt Cards"
Cohesion: 0.25
Nodes (4): springValues, TiltedCard(), TiltedCardProps, motion

## Knowledge Gaps
- **124 isolated node(s):** `display`, `bodyFont`, `metadata`, `viewport`, `PRINCIPLES` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `OS Interaction Layer` to `Project Configuration`, `Architecture Visualizations`, `Knowledge Graph UI`, `Portfolio Content and Memory`, `Intelligence Metrics`, `Navigation and Commands`, `Lighting Effects`, `Interactive Tilt Cards`, `System Terminal`?**
  _High betweenness centrality (0.305) - this node is a cross-community bridge._
- **What connects `display`, `bodyFont`, `metadata` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OS Interaction Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.09725158562367865 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Runtime Dependencies` to `Project Configuration`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `Project Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Application Shell and Metadata` to `OS Interaction Layer`, `Project Configuration`, `Knowledge Graph UI`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `Design Principles` be split into smaller, more focused modules?**
  _Cohesion score 0.09879032258064516 - nodes in this community are weakly interconnected._
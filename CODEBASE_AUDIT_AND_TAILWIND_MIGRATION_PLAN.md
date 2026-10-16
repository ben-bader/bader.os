# BADER.OS Codebase Audit and Tailwind CSS Migration Plan

**Audit date:** 2026-10-15  
**Scope:** current repository source and configuration at `D:\Projects\Next  JS\bader.os`  
**Mode:** read-only audit; no application files, dependencies, or configuration were changed for this report.

## 1. Executive Summary

### Verified current state

- The active site is a Next.js App Router application on **Next.js 16.2.10**, **React 19.2.4**, and **TypeScript 5.9.3**. The root page renders `components/portfolio/PortfolioPage.tsx`; the projects archive and generated project-detail routes are separate server-rendered routes.
- The active portfolio combines two local content sources. `data/projects/` is the source for archive cards, project summaries, and detail pages. `lib/content.ts` also contains project descriptions, stacks, responsibilities, years, architecture nodes/edges, identity, education, internships, timeline data, and several older OS-page datasets. `PortfolioPage.tsx` joins selected project records from both sources by ID. This is the largest content consistency risk.
- The current interaction layer is small: `ConstellationNav.tsx` and `useActiveSection.ts` track six homepage anchors; `ExperienceRuntime.tsx` capability-checks the browser and dynamically loads the R3F canvas and GSAP orchestrator. The root layout mounts that runtime on every route.
- Styling is a **Tailwind CSS 4.3.3 plus native CSS hybrid**. `app/globals.css` imports Tailwind and contains 391 lines (about 331 selector blocks by a simple pattern count), the palette and layout variables, nearly all current visual styles, and responsive overrides. `ProjectCard.tsx` uses Tailwind utilities; the site’s major layout and motion styling remains named CSS. No CSS Modules or `tailwind.config.*` file were found.
- A separate, older `components/os/SystemOS.tsx` component tree and six visualization components have no path from an App Router entry point in the current source. They are **high-confidence unused candidates**, not confirmed dead code. The Graphify output also contains stale source nodes, so it is not a trustworthy current import graph.

### Highest-impact findings

| Priority | Finding | Impact / risk | Recommended next move |
|---|---|---|---|
| P0 | Project facts are duplicated between `data/projects/*.ts` and `lib/content.ts`. | Titles, roles, technology lists, status, and project relationships can diverge. | Make project records canonical; retain only graph-specific topology in a separate project-architecture module. |
| P0 | The old `SystemOS`/visualization generation is disconnected from active routes. | Adds maintenance surface and pulls in packages/content that appear unused by the current application. | Decide whether this generation is archived or intended for reuse before removing anything. |
| P1 | `app/globals.css` is a single global stylesheet with token values mixed with layout, page, and visual-effect rules. | Broad cascade effects make incremental migration and regression isolation harder. | Establish a Tailwind v4 token bridge first, then migrate one component group at a time. |
| P1 | `lib/content.ts`, `PortfolioPage.tsx`, `ExperienceCanvas.tsx`, and `LightRays.tsx` carry unrelated or substantial responsibilities. | Review and change impact are harder to contain. | Split only after the data ownership and old-generation decision are settled. |
| P1 | Several project docs no longer describe the current implementation. | Onboarding and future refactors can follow stale architecture. | Update README, `docs/architecture.md`, `docs/design-tokens.md`, and `public/images/projects/README.md`. |

### Recommended sequence

1. Record a reproducible UI baseline and decide what to do with the orphaned OS tree.
2. Consolidate project facts and split the active content modules without changing rendered output.
3. Add Tailwind v4 theme aliases for the existing CSS variables; do not change the visual design.
4. Migrate low-risk shared primitives, then page groups, while retaining the canvas, GSAP, and specialized CSS rules.
5. Remove candidate-unused code, assets, or packages only after a separate owner decision and route/runtime verification.

## 2. Repository and Framework Inventory

### Repository shape

There is no `src/` directory. The TypeScript alias `@/*` resolves from the repository root. Main code directories are `app/`, `components/`, `data/`, `lib/`, `system/`, and `types/`. Documentation is under `docs/`; static files are under `public/`.

### Installed versions

Versions below come from `npm ls --depth=0 --json` against the installed workspace, not only the semver ranges in `package.json`.

| Package | Installed version | Current source/config evidence |
|---|---:|---|
| Next.js | 16.2.10 | App Router, `next/image`, `next/link`, `next/dynamic`, metadata conventions |
| React / React DOM | 19.2.4 | Server and Client Components, hooks, R3F components |
| TypeScript | 5.9.3 | Strict project check; root alias in `tsconfig.json` |
| Tailwind CSS | 4.3.3 | `@import "tailwindcss"` and utility classes |
| `@tailwindcss/postcss` | 4.3.3 | `postcss.config.mjs` |
| GSAP | 3.15.0 | `MotionOrchestrator.tsx`, `ScrollTrigger` |
| `@gsap/react` | 2.1.2 | `useGSAP` in `MotionOrchestrator.tsx` |
| Three.js | 0.185.1 | `ExperienceCanvas.tsx`, `HeroMaterial.ts` |
| React Three Fiber | 9.6.1 | `ExperienceCanvas.tsx`; also patched by the repository patch |
| Drei | 10.7.7 | `useFBO` in `ExperienceCanvas.tsx` |
| Lenis | 1.3.25 | `ExperienceCanvas.tsx`, `lib/lenis.ts` |
| Motion | 13.4.3 | `components/ui/TiltedCard.tsx` only; that component is not reachable from current routes |
| OGL | 1.0.11 | `components/ui/LightRays.tsx` only; that component is not reachable from current routes |
| D3 | 7.9.0 | No source import found; also appears in `optimizePackageImports` |
| `@types/d3` | 7.4.3 | No source import/type reference found |
| Lucide React | 1.25.0 | Icons in active portfolio, project, and route components |
| ESLint / Next config | 9.39.5 / 16.2.10 | `eslint.config.mjs` |
| `patch-package` | 8.0.1 | `postinstall` script applies `patches/@react-three+fiber+9.6.1.patch` |

`npm ls` also reports five extraneous installed packages (`@emnapi/core`, `@emnapi/runtime`, `@emnapi/wasi-threads`, `@napi-rs/wasm-runtime`, `@tybys/wasm-util`). They were not changed; their ownership should be checked during a future dependency cleanup.

### Build, test, and styling configuration

| File | Verified responsibility |
|---|---|
| `package.json` | `dev`, `build`, `start`, `lint`, and `postinstall` scripts. There is no test script. |
| `package-lock.json` | npm lockfile v3; pins the dependency graph. |
| `tsconfig.json` | Strict TypeScript, `noEmit`, bundler resolution, `@/*` root alias, Next plugin. |
| `next.config.ts` | Image remote pattern/formats/device sizes; transpiles Three/R3F packages; production console removal; package import optimization; security-related response headers. |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin. |
| `eslint.config.mjs` | Next core-web-vitals and TypeScript rules; ignores `.next`, `out`, `build`, and generated `next-env.d.ts`. |
| `patches/@react-three+fiber+9.6.1.patch` | Maintained patch to compiled R3F bundles, including its clock behavior. `postinstall` reapplies it. Dependency upgrades may invalidate it. |
| `.gitignore` | Excludes `node_modules`, `.next`, build outputs, coverage, env files, and TypeScript build info. |

Tailwind is already installed and active. There is **no Tailwind JavaScript config**. The CSS entry and PostCSS plugin already match Tailwind v4’s documented Next.js setup. No shadcn/ui dependency or component library was found, despite `CLAUDE.md` mentioning shadcn/ui.

## 3. Application Routing and Page Architecture

### Routes

| Route/file | Rendering and behavior |
|---|---|
| `/` — `app/page.tsx` | Server Component; renders `PortfolioPage`. |
| `/projects` — `app/projects/page.tsx` | Server Component; gets all project records and renders `ProjectCard` items. |
| `/projects/[id]` — `app/projects/[id]/page.tsx` | Async server route. `generateStaticParams()` enumerates `getAllProjectIds()`. `dynamicParams = false` limits valid IDs to the local catalog. Metadata comes from the project record. |
| Not found — `app/not-found.tsx` | Next App Router not-found convention. |
| Loading — `app/loading.tsx` | Next loading convention; renders a centered status string. |
| `/robots.txt` — `app/robots.ts` | Metadata route allowing crawling and pointing to sitemap. |
| `/sitemap.xml` — `app/sitemap.ts` | Metadata route with home, archive, and one URL per project. `lastModified` for home is generated with `new Date()`. |
| `/icon.svg` — `app/icon.svg` | App Router icon-file convention. |

### Active composition

`app/layout.tsx` sets metadata, viewport values, JSON-LD, fonts, global CSS, skip link, page content wrapper, and `ExperienceRuntime`. It does not render the site header globally.

`PortfolioPage.tsx` currently composes the home header and constellation navigation, then six anchored sections: home/hero, selected work, about, capabilities, journey, and contact; it also renders the footer. `SectionIntro` and `SystemMap` are local helper components in the same file. Project cards on the homepage are assembled by joining `getFeaturedProjects()` and `projectSystems` by project ID; supporting work is selected from `projectSystems.slice(2)` and rejoined to project data.

The archive uses `data/projects` through `lib/projects.ts`. The detail route resolves the same records and passes the full project array to `ProjectDetail`, which renders breadcrumbs, title/summary, preview, overview, features, technology implementation, architecture, optional role/team/challenges/learnings, technology labels, and previous/next links.

### Content ownership and duplication

- `data/projects/*.ts` contains eleven typed `Project` records and is used by the archive and project detail routes.
- `lib/content.ts` contains identity, education, internships, timeline data, project graph records, technology knowledge data, and old OS-generation datasets. Active homepage and experience code reads a subset of it.
- Project facts overlap: both `data/projects/*.ts` and `projectSystems` in `lib/content.ts` carry names, summaries/descriptions, stacks, category/status/year, and contribution or role information. The active homepage deliberately merges the records, which makes inconsistent values possible.
- `TIMELINE` also composes items from education/internship records; keep that derivation explicit if the source modules are split.

### Animation and 3D runtime

`ExperienceRuntime` runs in a client effect after hydration, determines capability/reduced-motion/WebGL availability, connects the pointer and scroll buses, and dynamically loads `ExperienceCanvas` and `MotionOrchestrator` with `ssr: false`. `ExperienceCanvas` uses R3F, Drei’s `useFBO`, Three.js materials from `HeroMaterial.ts`, and project topology from `projectSystems`. `FrameBridge` advances Lenis and updates shared buses. `MotionOrchestrator` registers GSAP/ScrollTrigger and uses `useGSAP` cleanup. It targets `#main-content > section`, `#layer-legacy`, `.project-record`, and `.technical-flow`.

The runtime is mounted in the root layout on every route. The canvas is therefore available on archive and detail routes too; the GSAP chapter selector is specifically aligned with the homepage’s direct child sections, while project-focus behavior depends on `.project-record` elements. Route-specific runtime loading is a possible optimization, but should be evaluated against the intended cross-route visual effect before changing it.

## 4. Complete File Usage Inventory

### `app/`

| Path | Category / responsibility | Used by / dependencies | Status / evidence | Recommendation / risk |
|---|---|---|---|---|
| `app/layout.tsx` | Root layout, metadata, fonts, JSON-LD, global wrappers | Next root convention; `lib/content.ts`, `SkipLink`, `ExperienceRuntime`, `globals.css` | **Verified used** by App Router convention | Keep; high impact if changed. |
| `app/page.tsx` | Home route entry | Next route convention; imports `PortfolioPage` | **Verified used** | Keep as thin route composition. |
| `app/projects/page.tsx` | Archive route, metadata, cards | `lib/projects.ts`, `ProjectCard`, Next Link | **Verified used** | Keep; low risk. |
| `app/projects/[id]/page.tsx` | Dynamic detail route, metadata, static params | `lib/projects.ts`, `ProjectDetail`, Next navigation | **Verified used**; all IDs derive from catalog | Keep; validate route IDs whenever catalog changes. |
| `app/not-found.tsx` | App Router not-found UI | Next convention; Link, Lucide | **Verified used** by convention | Keep. |
| `app/loading.tsx` | App Router loading UI | Next convention | **Likely used** during route loading/navigation | Keep unless the loading boundary is deliberately removed. |
| `app/robots.ts` | Robots metadata route | Next convention | **Verified used** | Keep. |
| `app/sitemap.ts` | Sitemap metadata route | Next convention; `lib/projects.ts` | **Verified used** | Keep; consider stable date semantics for home `lastModified`. |
| `app/icon.svg` | Site icon | Next icon-file convention | **Verified used** | Keep. |
| `app/globals.css` | Tailwind import, tokens, active page styles, responsive rules, motion and canvas layering | Imported by root layout | **Verified used** | Keep during migration; migrate incrementally. High regression risk. |

### `components/`

| Path | Category / responsibility | Used by / dependencies | Status / evidence | Recommendation / risk |
|---|---|---|---|---|
| `components/portfolio/PortfolioPage.tsx` | Home page section composition, project joining, local `SectionIntro`/`SystemMap` | `app/page.tsx`; content and project helpers; header/nav | **Verified used** | Keep; split into section files only after data ownership cleanup. High visual risk. |
| `components/portfolio/SiteHeader.tsx` | Home wordmark and contact CTA | `PortfolioPage`; Lucide | **Verified used**, Server Component | Keep. README incorrectly describes it as a Client Component. |
| `components/portfolio/ConstellationNav.tsx` | Fixed six-anchor SVG section navigation and active label | `PortfolioPage`; `useActiveSection` | **Verified used**, Client Component | Keep; interaction and breakpoint tests required for styling changes. |
| `components/portfolio/useActiveSection.ts` | Active-section hook using IntersectionObserver, ResizeObserver, scroll/resize events | `ConstellationNav` | **Verified used** | Keep; preserve observer/listener cleanup and anchor IDs. |
| `components/projects/ProjectCard.tsx` | Archive card and project/repository links | `app/projects/page.tsx`; Project type, Link, Lucide, Tailwind utilities | **Verified used**, Server Component | Keep; useful first Tailwind migration target. |
| `components/projects/ProjectDetail.tsx` | Detail-page composition and string-list renderer | Dynamic route; `ProjectPreview`, project data, Next Image/Link, Lucide | **Verified used**, Server Component | Keep; later extract a hero and typed repeated sections if it materially improves readability. |
| `components/projects/ProjectPreview.tsx` | 16:10 image or accessible preview placeholder | `ProjectDetail`; Next Image, Lucide | **Verified used** | Keep; preserve aspect ratio and layout reservation. |
| `components/ui/SkipLink.tsx` | Keyboard skip link | Root layout | **Verified used** | Keep; preserve visible focus behavior and z-index. |
| `components/experience/ExperienceRuntime.tsx` | Browser capability detection, event/bus setup, dynamic imports | Root layout; capabilities and pointer/scroll buses | **Verified used**, Client Component | Keep; global mounting cost should be considered before route-specific optimization. |
| `components/experience/ExperienceCanvas.tsx` | R3F frame bridge, shader scene, 3D B and project focus visual | Dynamic import from runtime; Three, R3F, Drei, Lenis, buses, content, material helpers | **Verified used**, Client Component | Keep; high complexity/performance risk. Isolate from utility migration. |
| `components/experience/HeroMaterial.ts` | Three.js material/shader factories | `ExperienceCanvas`; Three.js, capability type | **Verified used** | Keep; custom shader code should remain outside Tailwind. |
| `components/experience/MotionOrchestrator.tsx` | GSAP section reveals/project focus and pointer/focus listeners | Dynamic import from runtime; GSAP, buses | **Verified used**, Client Component | Keep; preserve selectors, transforms, and teardown. |
| `components/os/SystemOS.tsx` | Old seven-layer OS portfolio composition | Imports OS layers and navigator; no active route imports this root | **High-confidence candidate unused** | Do not delete as part of CSS migration until owner confirms the old experience is retired. |
| `components/os/Cursor.tsx` | Custom pointer cursor tied to `data-hover` | No importer found; old OS generation | **Candidate unused** | Check design history/route intention before removal. |
| `components/os/LayerCore.tsx` | Old OS identity/core section | Only imported by `SystemOS` | **Candidate unused** | Same orphan-tree decision as `SystemOS`. |
| `components/os/LayerSystems.tsx` | Old project systems list | Only imported by `SystemOS`; imports `ProjectRecord` | **Candidate unused** | Same; duplicates project rendering/data. |
| `components/os/LayerMemory.tsx` | Old education/work archive and memory details | Only imported by `SystemOS`; `TIMELINE`/`SectionHeading` | **Candidate unused** | Same; compare with active Journey section before removal. |
| `components/os/LayerKnowledge.tsx` | Old technology register | Only imported by `SystemOS`; project and technology data | **Candidate unused** | Same; its data is also a candidate for pruning. |
| `components/os/LayerProcess.tsx` | Old engineering process section | Only imported by `SystemOS`; `processSteps` | **Candidate unused** | Same. |
| `components/os/LayerIntelligence.tsx` | Old count/metrics section | Only imported by `SystemOS`; `intelligenceMetrics` | **Candidate unused** | Same. |
| `components/os/LayerLegacy.tsx` | Old contact/legacy section | Only imported by `SystemOS` | **Candidate unused** | Same. |
| `components/os/SystemNavigator.tsx` | Old seven-layer nav wired to `ScrollBus` | Only imported by `SystemOS`; `system/layers.ts` | **Candidate unused** | Same; do not confuse with active constellation nav. |
| `components/os/ProjectRecord.tsx` | Old project feature/responsibility card | Only imported by `LayerSystems`; imports `TechnicalFlow` | **Candidate unused** | Same; duplicates project presentation. |
| `components/os/SectionHeading.tsx` | Old OS section heading primitive | Only imported by old OS layer files | **Candidate unused** | Retain only if old tree is retained. |
| `components/os/TechnicalFlow.tsx` | Old text flow/edge renderer for `ProjectSystem` | Only imported by `ProjectRecord` | **Candidate unused** | Retain only if old tree is retained. |
| `components/visualizations/ArchDiagram.tsx` | Older project architecture visual | No importer found | **Candidate unused** | Verify design intent and dynamic references before deletion. |
| `components/visualizations/ArchFlow.tsx` | Interactive project flow/canvas visual | No importer found; imports `projectSystems` | **Candidate unused** | Large interaction surface; verify before deletion. |
| `components/visualizations/CircuitTrace.tsx` | Canvas/circuit-style architecture trace | No importer found; imports `projectSystems` | **Candidate unused** | Verify before deletion. |
| `components/visualizations/KnowledgeGraph.tsx` | Interactive knowledge graph canvas | No importer found; imports `knowledgeNodes` | **Candidate unused** | Verify before deletion. |
| `components/visualizations/SignalField.tsx` | Animated knowledge signal field | No importer found; imports `knowledgeNodes` | **Candidate unused** | Verify before deletion. |
| `components/visualizations/TechMap.tsx` | Technology relationship map | No importer found; imports `knowledgeNodes` | **Candidate unused** | Verify before deletion. |
| `components/ui/AmbientField.tsx` | OGL/WebGL ambient background | No importer found | **Candidate unused** | Verify before deletion; shares visual domain with active canvas. |
| `components/ui/CommandPalette.tsx` | Keyboard command palette and old layer commands | No importer found; uses `LAYERS`, `scrollToId` | **Candidate unused** | Verify shortcuts/entry point before removal. |
| `components/ui/KonamiEgg.tsx` | Keyboard-sequence easter egg overlay | No importer found | **Candidate unused** | Verify intentional product behavior before removal. |
| `components/ui/LightRays.tsx` | Large OGL light-ray canvas | No importer found | **Candidate unused** | Verify before deletion; OGL dependency currently rests on this component. |
| `components/ui/OSLoader.tsx` | Old animated boot/loading screen | No importer found; uses `easeOutExpo` | **Candidate unused** | Verify before deletion; distinct from active `app/loading.tsx`. |
| `components/ui/ScrollProgress.tsx` | Old scroll progress indicator | No importer found | **Candidate unused** | Verify before deletion. |
| `components/ui/TiltedCard.tsx` | Motion-based interactive card | No importer found; uses `motion/react` | **Candidate unused** | Verify before deleting; `motion` dependency is only found here. |

The orphan classification is based on current App Router entries, direct imports, and the dynamic-import search. An unreferenced component can still be intentionally retained for a future route or external consumer; no files are marked “confirmed dead.”

### `data/`, `lib/`, `system/`, and `types/`

| Path | Category / responsibility | Used by / dependencies | Status / evidence | Recommendation / risk |
|---|---|---|---|---|
| `data/projects/index.ts` | Stable project catalog and ID validation | `lib/projects.ts`; imports all records | **Verified used** | Keep; catalog is the route source of truth. |
| `data/projects/anime.ts` | Anime World project record | Catalog index | **Verified used** | Keep. |
| `data/projects/atlashr.ts` | AtlasHR project record | Catalog index | **Verified used** | Keep; align unique facts with `lib/content.ts`. |
| `data/projects/bader-os.ts` | Portfolio project record | Catalog index | **Verified used** | Keep. |
| `data/projects/bank-modern-app.ts` | Banking UI project record/image reference | Catalog index; `/projects/bank-modern-app.png` | **Verified used** | Keep. |
| `data/projects/gpt-3.ts` | GPT-3 interface concept record | Catalog index | **Verified used** | Keep. |
| `data/projects/homely.ts` | Homely team project record | Catalog index | **Verified used** | Keep; distinguish documented design from implementation evidence. |
| `data/projects/innovex.ts` | Innovex project record | Catalog index | **Verified used** | Keep. |
| `data/projects/modern-form.ts` | Form prototype record/image reference | Catalog index; `/projects/modern-form.png` | **Verified used** | Keep. |
| `data/projects/nike.ts` | Landing-page project record/image reference | Catalog index; `/projects/nike.png` | **Verified used** | Keep. |
| `data/projects/onee-sys.ts` | ONEE-SYS project record | Catalog index; repository URL | **Verified used** | Keep; align project facts with experience record. |
| `data/projects/zentry.ts` | Zentry recreation record/image reference | Catalog index; `/projects/zentry.png` | **Verified used** | Keep. |
| `lib/projects.ts` | Pure project catalog selectors | Archive, dynamic route, homepage | **Verified used** | Keep; no external storage layer needed. |
| `lib/content.ts` | Identity, education, internships, skills, graph nodes/edges, timeline, old OS page data | Root metadata, `PortfolioPage`, active `ExperienceCanvas`, orphan components | **Verified used, but mixed scope** | Split into focused modules; first settle project fact ownership. High content consistency risk. |
| `lib/experience/capabilities.ts` | WebGL/device/reduced-motion capability classification | `ExperienceRuntime`, `ExperienceCanvas` types | **Verified used** | Keep; browser APIs stay inside effects/runtime. |
| `lib/experience/PointerBus.ts` | Shared pointer position/state | `ExperienceRuntime`, `ExperienceCanvas`, `MotionOrchestrator` | **Verified used** | Keep; animation integration, not a utility-class target. |
| `lib/experience/ProjectFocusBus.ts` | Shared focused project ID/progress/rect | Scroll bus, canvas, orchestrator | **Verified used** | Keep; preserve state transitions and subscriptions. |
| `lib/experience/ScrollBus.ts` | Shared scroll state, section, velocity, focus-rect movement | Runtime, canvas; also old navigator | **Verified used** | Keep; active IDs are coupled to homepage section IDs. |
| `lib/lenis.ts` | Lenis singleton bridge and anchor scrolling | `ExperienceCanvas` uses `getLenis`/`setLenis`; `scrollToId` only used by orphan command palette | **Partly used** | Keep used exports; consider isolating `scrollToId` if the old palette is retired. |
| `lib/utils.ts` | `easeOutExpo` easing helper | Only `OSLoader`, which has no importer | **Candidate unused export/file** | Confirm old loader ownership before removal. |
| `system/layers.ts` | Seven old OS layer records/type | Old navigator and command palette only | **Candidate unused module** | Retain only if old OS tree remains. |
| `types/project.ts` | Project and status schema | Catalog, cards, detail, selectors | **Verified used** | Keep; future content consolidation should preserve route-facing type compatibility. |

### `public/` assets

| Path | Category / responsibility | Runtime reference | Status / recommendation |
|---|---|---|---|
| `public/resume.pdf` | Résumé PDF | `identity.resume` in `lib/content.ts`; homepage/contact links | **Verified used**; keep. |
| `public/projects/bank-modern-app.png` | Project screenshot | `data/projects/bank-modern-app.ts` | **Verified used**; keep. |
| `public/projects/modern-form.png` | Project screenshot | `data/projects/modern-form.ts` | **Verified used**; keep. |
| `public/projects/nike.png` | Project screenshot | `data/projects/nike.ts` | **Verified used**; keep. |
| `public/projects/zentry.png` | Project screenshot | `data/projects/zentry.ts` | **Verified used**; keep. |
| `public/projects/user-management-pro.png` | Screenshot for a catalog-excluded project | No project data or source reference found | **High-confidence asset candidate**; verify external links/history before removal. |
| `public/file.svg` | Starter-style SVG | No source reference found | **Candidate unused**; direct public URL could still be externally linked. |
| `public/globe.svg` | Starter-style SVG | No source reference found | **Candidate unused**; same verification caveat. |
| `public/next.svg` | Starter-style SVG | No source reference found | **Candidate unused**; same verification caveat. |
| `public/vercel.svg` | Starter-style SVG | No source reference found | **Candidate unused**; same verification caveat. |
| `public/window.svg` | Starter-style SVG | No source reference found | **Candidate unused**; same verification caveat. |
| `public/images/projects/README.md` | Old media workflow instructions | No runtime reference; names `content/projects.ts` and `ProjectMedia`, neither present in the active source tree | **Stale documentation**; rewrite after confirming desired asset workflow. |

### `docs/`, root documentation, and generated/vendor paths

Documentation has no application importers; it is human/agent reference material. It was inspected for architecture, styling, and stale statements.

| Path | Responsibility / audit result |
|---|---|
| `README.md` | Product and local setup overview; stale on SiteHeader’s client boundary and screenshots location. |
| `AGENTS.md` | Repository-specific Next.js 16 docs requirement; active agent instruction. |
| `CLAUDE.md` | Frontend conventions; mentions shadcn/ui and forbids inline CSS, while the package/source has no shadcn/ui and does contain style props. |
| `.cursorrules` | Editor/agent conventions; same mismatch around inline styles and technology inventory. |
| `docs/accessibility.md` | Accessibility direction; reference material, not runtime. |
| `docs/animation-guidelines.md` | Motion direction; reference material. |
| `docs/architecture.md` | Architecture notes; stale on SiteHeader/IntersectionObserver details and does not describe the active constellation nav accurately. |
| `docs/coding-style.md` | Coding conventions. |
| `docs/component-guidelines.md` | Component direction. |
| `docs/creative-direction.md` | Visual concept and product sequence. |
| `docs/design-system.md` | Design-system direction. |
| `docs/design-tokens.md` | Palette values mostly match CSS; font section is stale (says native system sans, while layout loads Poppins/Manrope). It also describes the old media directory. |
| `docs/frontend-laws.md` | Frontend principles. |
| `docs/frontend-standards.md` | Frontend standards. |
| `docs/gsap-guidelines.md` | GSAP conventions; reference material. |
| `docs/performance.md` | Performance guidance. |
| `docs/portfolio-specification.md` | Product specification; compare to live routes/components before treating as current. |
| `docs/project-principles.md` | Project content principles. |
| `docs/projects-repository-inventory.md` | Evidence inventory for project descriptions; audit documentation, not runtime. |
| `docs/threejs-guidelines.md` | Three.js conventions. |
| `docs/ui-ux-principles.md` | UX principles. |

Root/configuration files additionally inventoried: `.vscode/settings.json` (editor settings), `eslint.config.mjs`, `next.config.ts`, `package.json`, `package-lock.json`, `postcss.config.mjs`, `tsconfig.json`, and `patches/@react-three+fiber+9.6.1.patch` (described above). `node_modules/` is vendor-managed; `.next/` is generated build output; `.git/` is repository metadata; `graphify-out/` is generated graph output. These are excluded from ordinary application-source inventory. No app test directory or test files were found.

## 5. Component and Dependency Graph

```mermaid
flowchart TD
  Layout[app/layout.tsx] --> Skip[SkipLink]
  Layout --> Runtime[ExperienceRuntime]
  Layout --> Routes[App Router children]

  Routes --> HomeRoute[app/page.tsx]
  HomeRoute --> Portfolio[PortfolioPage]
  Portfolio --> Header[SiteHeader]
  Portfolio --> Nav[ConstellationNav]
  Nav --> ActiveHook[useActiveSection]
  Portfolio --> HomeProjects[featured/supporting project composition]
  HomeProjects --> ProjectAPI[lib/projects.ts]
  HomeProjects --> ProjectData[data/projects/index.ts]
  HomeProjects --> Content[lib/content.ts: projectSystems, internships, TIMELINE]

  Routes --> Archive[app/projects/page.tsx]
  Archive --> ProjectAPI
  Archive --> Card[ProjectCard]
  Routes --> DetailRoute[app/projects/[id]/page.tsx]
  DetailRoute --> ProjectAPI
  DetailRoute --> Detail[ProjectDetail]
  Detail --> Preview[ProjectPreview]
  Detail --> ProjectData

  Runtime -->|dynamic, ssr:false| Canvas[ExperienceCanvas]
  Runtime -->|dynamic, ssr:false| Motion[MotionOrchestrator]
  Canvas --> Material[HeroMaterial]
  Canvas --> Buses[PointerBus / ScrollBus / ProjectFocusBus]
  Canvas --> Content
  Motion --> Buses
  Motion --> GSAP[GSAP + ScrollTrigger]

  Orphan[components/os/SystemOS.tsx] -. no active route/import .-> OldTree[old OS layers + navigator]
  OldTree -.-> OldViz[old visualization components]
```

### Dependency observations

- No circular dependency was found in the reviewed local import edges.
- `ExperienceRuntime` is the active client boundary for two dynamically imported client features. The visual canvas and animation runtime should remain separate from server page composition.
- Active display and interactive state are separated reasonably in the homepage: `PortfolioPage` is a Server Component; only the constellation and its observer hook need client-side state.
- `projectSystems` is shared across homepage diagrams and the 3D focus visualization. Its graph node/edge data is unique, but its descriptive fields overlap with `Project` records.
- `SystemOS` is not a hidden App Router route: it is in `components/`, has no current importer, and no App Router file convention automatically makes it a route.
- The committed Graphify graph contains 316 nodes but returned a node for `hooks/useInView.ts`, which does not exist in the current tree. Treat `graphify-out/graph.json` and `graph.html` as stale visualizations, not source evidence. They were not rebuilt during this audit.

## 6. Proposed Component Architecture

Keep the existing root-level organization and avoid introducing a `src/` wrapper. Split only at useful behavioral/content boundaries.

```text
app/
  layout.tsx
  page.tsx
  projects/
    page.tsx
    [id]/page.tsx
components/
  portfolio/                 # page composition and homepage sections
    PortfolioPage.tsx        # server composition
    sections/                # Hero, SelectedWork, About, Capabilities, Journey, Contact
  navigation/                # SiteHeader, ConstellationNav, useActiveSection
  projects/                  # ProjectCard, ProjectDetail, ProjectPreview, detail sections
  experience/                # runtime, canvas, material, motion orchestration
  ui/                        # SkipLink and confirmed shared primitives only
data/
  projects/                  # canonical project facts and display copy
  project-architecture/      # only unique nodes, edges, and diagram metadata
lib/
  content/                   # identity, education/work history, timeline selectors
  experience/                # capability and state buses
  projects.ts                # catalog selectors
system/                      # retain only if old OS experience is explicitly kept
types/
  project.ts
app/globals.css              # token bridge + intentional visual/animation CSS during migration
```

| Existing area | Proposed boundary | Rationale / server-client split |
|---|---|---|
| `PortfolioPage.tsx` | Remain a Server Component composition; extract sections only when the split reduces its 200-line composition/data-mapping load. | Sections are data rendering; they do not need client state. The constellation remains independently client-side. |
| Local `SectionIntro` | Keep local or move to a shared home-section module if archive/detail pages adopt the same visual primitive. | Avoid extracting a one-use wrapper prematurely. |
| Local `SystemMap` | Separate from page composition and take a typed project-architecture record if it becomes independently reused. | The map is a view over node/edge data, not a project-data owner. |
| `SiteHeader` / `ConstellationNav` | Move to `components/navigation/` only when doing the module split. | Header markup is server-compatible; active section state stays in the client constellation. |
| `ProjectCard` | Keep as a small server component; factor shared technology labels only if they repeat on active pages. | No client interaction is required; links work as native navigation. |
| `ProjectDetail` | Keep server-rendered. Extract `ProjectDetailHero` and typed section/list renderers only if the file grows further. | Data and semantics are server-renderable; no need for a broad client boundary. |
| `ExperienceRuntime`, `ExperienceCanvas`, `MotionOrchestrator` | Keep in the experience boundary and dynamically load canvas/motion code. | Browser APIs, WebGL, GSAP, and event buses require client execution; route-level mounting is a later performance decision. |
| `components/os/` and `components/visualizations/` | Do not fold these into the active architecture unless the old system UI is intentionally reactivated. | Their current route reachability is absent and some styles/data belong to an older design generation. |

### Data ownership proposal

1. Keep `data/projects/*.ts` as the canonical user-facing project record.
2. Move only diagram-specific `nodes` and `edges` plus any stable year/order metadata into `data/project-architecture/` or equivalent.
3. Have homepage records join by ID through one helper rather than copying descriptive fields into a second project record.
4. Split `lib/content.ts` by domain: identity, education/internship history, timeline, and active project architecture. Move old OS-only data with the old component tree until its status is decided.
5. Keep `Project` route IDs and dynamic route lookup unchanged during this refactor.

## 7. Unused Files, Components, CSS, and Dependencies

### Confirmed dead code

**None classified as confirmed dead.** Static non-reference is not enough to prove safe removal, especially for direct public URLs, future routes, editor integrations, or design experiments.

### High-confidence candidates

| Candidate | Evidence | Confidence | Verification before removal |
|---|---|---:|---|
| `components/os/SystemOS.tsx` and its old layer tree | No import from `app/`; `app/page.tsx` selects `PortfolioPage`; `SystemOS` itself only imports its own old layer modules. | High | Confirm the OS page is intentionally retired and check history/branches for an alternate route. |
| `components/visualizations/ArchDiagram.tsx`, `ArchFlow.tsx`, `CircuitTrace.tsx`, `KnowledgeGraph.tsx`, `SignalField.tsx`, `TechMap.tsx` | No current importer or dynamic import found. Several rely on the old visual system and data. | High | Search deployment overlays/external consumers and confirm no planned route uses them. |
| `components/ui/AmbientField.tsx`, `CommandPalette.tsx`, `KonamiEgg.tsx`, `LightRays.tsx`, `OSLoader.tsx`, `ScrollProgress.tsx`, `TiltedCard.tsx`; `components/os/Cursor.tsx` | No current importer found. `OSLoader` is distinct from App Router `app/loading.tsx`. | High | Check keyboard commands and intended easter egg/cursor behavior in product history. |
| `lib/utils.ts` / `easeOutExpo` | Only source consumer is `OSLoader`, itself unreferenced. | High | Remove only with the old loader decision. |
| `system/layers.ts` | Only consumers found are the old navigator and command palette. | High | Remove only with the old tree. |
| `memoryFragments`, `systemStats` in `lib/content.ts` | No source consumer found. | High | Check external JSON/graph consumers and old designs. |
| `techByCategory`, `knowledgeNodes` in `lib/content.ts` | Consumed only by old OS/visualization candidates. | High, conditional on old-tree retirement | Confirm whether the old visualizations will be restored. |
| `processSteps`, `intelligenceMetrics` in `lib/content.ts` | Consumed only by old OS layers. | High, conditional on old-tree retirement | Same old-tree decision. |
| `scrollToId` export in `lib/lenis.ts` | Only source consumer found is the old `CommandPalette`; `getLenis`/`setLenis` remain active. | High for export, not file | Remove only the export if palette is retired; keep the module. |
| `public/projects/user-management-pro.png` | No project record or source reference found. | High | Check direct external URLs and whether the excluded project will return to the catalog. |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | No local source reference found. | Medium-high | Check direct URL use in external content before removing public files. |
| `.project-evidence-note` CSS selector | Selector declaration exists in `app/globals.css`; no matching markup/class construction found. | Medium-high | Re-run the scan after any content CMS/HTML injection is introduced. |

### Dependency and configuration candidates

| Package/config | Evidence | Recommendation |
|---|---|---|
| `d3` | No source import found. `next.config.ts` still lists it in `optimizePackageImports`. | Candidate dependency and config entry; check external/indirect use before removal. |
| `@types/d3` | No type import found. | Candidate dev dependency alongside D3, conditional on package graph review. |
| `motion` | Only import is in unreferenced `TiltedCard.tsx`. | Candidate if that component is retired. |
| `ogl` | Only import is in unreferenced `LightRays.tsx`. | Candidate if that component is retired. |
| `@react-three/fiber` patch | `postinstall` applies a patch to compiled package output. | Keep while required; add an explicit upgrade/revalidation task for every R3F version change. |
| `next.config.ts` `avatars.githubusercontent.com` image pattern | No active `next/image` source uses a remote host in the project records. | Verify whether public profile images are planned before pruning. |

### Duplication and uncertain findings

- **Content duplication:** project facts live in both project records and `projectSystems`. This is verified; whether each field should be removed depends on the desired source-of-truth model.
- **CSS token candidates:** `--space-*`, `--surface-raised`, `--success`, `--font-code`, `--ease`, and `--motion-normal` are declared, but no `var(...)` use was found in active source. They may be reserved tokens; consolidate or remove only after deciding the target theme.
- **Current CSS variables referenced by old components:** old visualizations include `--surface-1`, `--surface-2`, `--wire`, `--text-0`, `--text-2`, `--text-3`, and `--sp-*`; those names are not defined in current `app/globals.css`. They are not a current-route defect because those components are not mounted, but would need resolution if reactivated.
- **Generated Graphify artifacts:** `graphify-out/graph.html` / `graph.json` are generated/vendor-like audit artifacts, and the graph’s source list is stale. They were queried, not refreshed. The user should not use that visual as the current source inventory until graph extraction is regenerated.

## 8. Native CSS and Design-Token Audit

### Stylesheet inventory

| Path | Approximate size / groups | Token and selector coupling | Migration complexity / risk |
|---|---|---|---|
| `app/globals.css` | 391 lines; roughly 331 selector blocks by a simple regex count; six media-query blocks; two keyframes. Groups: reset/base, canvas and shell, header/constellation, hero, home work/about/capabilities/journey/contact/footer, reduced motion, archive cards, detail page, responsive overrides. | Global element selectors; `:root` tokens; `html.lenis`; `body:has(.experience-canvas)`; `aria-current`; `.project-record`; `.technical-flow`; several GSAP-mutated elements and CSS custom properties. | **High.** Migrate by named component group; retain global and effect rules initially. |

No CSS Modules, component CSS files, Sass, CSS-in-JS stylesheet imports, or third-party stylesheet imports were found. Tailwind’s generated preflight/utilities are included through the global import. Components also contain inline React `style` props for dynamic coordinates, SVG/nav positions, and WebGL/data visualization values; those are not stylesheet files and must be inventoried during component migration.

### Existing custom properties (actual values)

| Group | Existing CSS variables |
|---|---|
| Background/surface | `--background: #101315`; `--background-soft: #151a1c`; `--surface: #1b2223`; `--surface-raised: #202827` |
| Text | `--foreground: #f0f3ee`; `--foreground-secondary: #c0c8c1`; `--muted: #a3aea7` |
| Accent/state | `--accent: #c6f36b`; `--accent-hover: #d7ff83`; `--accent-ink: #182010`; `--success: #b6d38f` |
| Separators | `--border: rgba(235, 242, 234, .14)`; `--border-strong: rgba(235, 242, 234, .26)` |
| Shadow | `--shadow: 0 32px 100px rgba(0, 0, 0, .28)` |
| Fonts | `--font-display: var(--font-manrope), ui-sans-serif, system-ui, sans-serif`; `--font-body: var(--font-poppins), ui-sans-serif, system-ui, sans-serif`; `--font-code: ui-monospace, "SFMono-Regular", Consolas, monospace` |
| Spacing | `--space-1: .25rem`, `--space-2: .5rem`, `--space-3: .75rem`, `--space-4: 1rem`, `--space-6: 1.5rem`, `--space-8: 2rem`, `--space-12: 3rem`, `--space-16: 4rem`, `--space-24: 6rem` |
| Layout | `--page-width: 1520px`; `--page-gutter: clamp(1.25rem, 5.2vw, 5.25rem)` |
| Motion | `--ease: cubic-bezier(.2, .75, .25, 1)`; `--motion-fast: 160ms`; `--motion-normal: 260ms` |

Actual font loading is in `app/layout.tsx`: `Poppins` weights 400/500/600 and `Manrope`, both via `next/font/google` and CSS variables. This contradicts `docs/design-tokens.md` and parts of README architecture wording that describe native system fonts.

### Layout, breakpoints, and layering

- Page content uses `--page-width` and `--page-gutter`; many sections still specify independent `clamp()` padding and gaps rather than the `--space-*` scale.
- Breakpoints are currently distributed across `max-width: 900px`, `min-width: 901px and max-width: 1200px`, `max-width: 640px`, `min-width: 701px and max-width: 900px`, and `max-width: 700px`. Home and project styles use different mobile cutoffs. Consolidate only after responsive regression baselines exist.
- Z-index values are literal: canvas 0, content 1, header 40, constellation navigation 45, skip link 1000. A legacy Tailwind-only component also includes `z-[99999]`; it is not active. There is no shared z-index scale.
- Border radii are mostly literal 3px/4px, pill/circle, or component-specific values. There is no shared radius scale. The active visual language is mostly square surfaces and fine borders.
- The only shared shadow token found is `--shadow`; blur, text shadow, and colored drop shadows are otherwise local to hero/canvas/navigation visuals.
- Two selector blocks target `.header-cta`; their declarations are additive and can be combined when the header is next edited. Responsive overrides are repeated by design, but the breakpoint split increases review cost.
- The old `--space-*` set is not consumed by `var()` in app/components; actual layout relies heavily on literals and `clamp()`. The custom space tokens should become useful utilities or be retired after inventory.
- `body:has(.experience-canvas)` is used to toggle the 3D fallback. It is a DOM-structure-dependent global selector and should remain named CSS until a deliberate fallback API replaces it.
- `html.lenis` rules are coupled to Lenis’s class behavior. `.project-record`, `#main-content > section`, `.technical-flow`, and `--project-hover`/pointer variables are coupled to GSAP/R3F and must not be renamed or overridden casually.
- Two CSS keyframes are defined: `constellation-label-in` and `orbit`. A reduced-motion query shortens CSS animations/transitions and disables smooth scrolling; the runtime also avoids loading the canvas/orchestrator when reduced motion is requested.

### What Tailwind helps with—and does not

Tailwind is well suited to repeatable layout, responsive spacing, typography, border/surface, flex/grid, and focus-state classes. It can make the current single file’s repeated layout declarations easier to locate by component. It does not remove the need for GSAP selector contracts, the R3F canvas layer, shader materials, CSS keyframes, pseudo-element diagrams, `:has()` fallback logic, or complicated responsive compositions. Keep those effects in named CSS or TypeScript where they are clearer and independently testable.

## 9. Proposed Tailwind Configuration

### Correct target: existing Tailwind v4

The project has Tailwind 4.3.3, `@tailwindcss/postcss` 4.3.3, `postcss.config.mjs`, and `@import "tailwindcss"` at the top of `app/globals.css`. No JavaScript config exists. **Use Tailwind v4’s CSS-first `@theme` setup; do not add a v3 `content`/`theme.extend` configuration.** The official Next.js guide uses the same PostCSS plugin and CSS import already present, and Tailwind documents `@theme` as the mechanism that maps design tokens to utilities: [Tailwind + Next.js installation](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [theme variables](https://tailwindcss.com/docs/theme), [class detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).

### Representative token bridge (proposal only; not applied)

The following aliases preserve current `:root` values as the sole value source while making them available as Tailwind utilities. Add the complete mapping in the foundation phase and verify the generated CSS before migrating components.

```css
@import "tailwindcss";

@theme inline {
  --color-canvas: var(--background);
  --color-canvas-soft: var(--background-soft);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-foreground: var(--foreground);
  --color-copy: var(--foreground-secondary);
  --color-muted: var(--muted);
  --color-border-subtle: var(--border);
  --color-border-strong: var(--border-strong);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-on-accent: var(--accent-ink);
  --font-portfolio-display: var(--font-display);
  --font-portfolio-body: var(--font-body);
  --font-portfolio-code: var(--font-code);
  --spacing: 0.25rem;
  --shadow-panel: var(--shadow);
  --ease-portfolio: var(--ease);
  --duration-fast: var(--motion-fast);
  --duration-normal: var(--motion-normal);
}
```

`--font-portfolio-*` deliberately avoids colliding with existing CSS variables named `--font-display` and `--font-body`. Utilities would use names such as `bg-canvas`, `text-foreground`, `border-border-subtle`, and `font-portfolio-display`. `@theme inline` is appropriate for aliases that reference existing variables; Tailwind documents the distinction between theme variables and regular `:root` variables in its [theme guide](https://tailwindcss.com/docs/theme).

Do not copy the current 4px-based scale into `@theme` and keep two independently edited spacing systems. Either map the existing `--space-*` values intentionally or replace them with Tailwind’s 0.25rem spacing base after confirming the emitted utilities preserve measured layouts. Keep the current `:root` values until no legacy CSS depends on them.

### Token scope

- **Colors:** map the existing background, surface, text, border, and accent variables above. Do not add semantic error/warning colors without an actual UI state.
- **Typography:** preserve Manrope display and Poppins body via existing `next/font` variables; preserve monospace for code annotations. Do not duplicate font values in Tailwind and CSS.
- **Spacing/layout:** use the real 4px base and 1520px content width/gutter. Convert the current custom scale only after checking each variable’s present usage and layout screenshots.
- **Breakpoints:** do not force default Tailwind breakpoints onto the current 640/700/701/900/901/1200 CSS rules in the first phase. First normalize responsive behavior, then define named custom breakpoints if utility variants materially simplify it.
- **Shape/layering:** introduce named radius and z-index tokens only when consolidating the observed literal 3px/4px and 0/1/40/45/1000 values. Do not describe them as existing tokens.
- **Motion:** map 160ms/260ms and the existing easing value, while keeping keyframes and GSAP timing local to their animation system.

### Tailwind source scanning

Current class names are static strings; no dynamic `bg-${color}` construction was found in active components. Keep complete utility names in source. The v4 scanner treats source files as text and excludes ignored paths and `node_modules`; if future shared components live outside the normal scan base, register them with `@source` rather than introducing a v3 config. Orphan files can still contribute detectable utility strings because scanning is not equivalent to runtime import reachability.

## 10. Native CSS to Tailwind Migration Inventory

There is one stylesheet to migrate: `app/globals.css` (391 lines; approximately 331 selector blocks by a basic textual count, not a CSS AST count).

| CSS group in `app/globals.css` | Current responsibilities / actual selectors | Token use | Complexity | Proposed sequence / risk |
|---|---|---|---|---|
| Import, `:root`, reset, body, global focus, `.page-wrap` | Tailwind import; design variables; box sizing, body font/background, selection, element defaults, focus ring, page max width/gutter | Colors/fonts/layout/motion | Medium | Phase 1 token bridge; leave reset/global rules in CSS. Risk: Tailwind preflight and browser-default changes. |
| Canvas/fallback and skip link | `.portfolio-content`, `.experience-canvas`, `.experience-fallback`, `.skip-link` | Z-index literals, accent, canvas layering | High | Keep named CSS; validate focus visibility and canvas/content stacking. |
| Header and constellation | `.site-header`, wordmark, CTA, constellation lines/stars/labels, active state, label keyframe | Color, border, motion; many SVG/pseudo rules | High | Migrate outer layout only after responsive baseline; preserve `data-label`, `aria-current`, pseudo-element and nav geometry. |
| Home hero and artwork | `.hero`, `.hero-copy`, `.hero-art`, orbit, code core, fallback letter, scroll cue | Widths, clamp spacing/type, fixed offsets, animation | High | Keep orbital artwork, pseudo-elements and transforms in CSS; migrate typography/gap/surface utilities after baseline. |
| Work and project-record visuals | `.work-section`, `.work-entry`, `.work-visual`, `.technical-flow`, `.project-record`, map nodes/edges, hover focus | Shared surfaces, borders, shadow; `--project-hover`, pointer CSS vars | High | After token foundation; retain GSAP target names and animation properties. |
| About, capabilities, journey, contact, footer | Section grids, timeline, links, typography, separators | Page width/gutters, spacing, muted/accent, border | Medium-high | Migrate one section at a time; check mobile stacking, focus and timeline pseudo-lines. |
| Archive/cards | `.projects-page`, archive intro/grid, `.catalog-card`, `.catalog-tech`, action links | Surface, border, text, accent | Low-medium | First candidate group after token bridge; `ProjectCard` already uses a few Tailwind utilities. Check title/status wrap and card heights. |
| Project detail/preview | Breadcrumbs, detail hero grid, 16:10 preview, detail sections, implementation list, sidebar, neighbors | Page width, border, muted text, layout gap | Medium | Migrate after card/archive; preserve reserved preview ratio, image crop, sticky aside, mobile stack. |
| Responsive overrides | 640, 700/701, 900/901, 1200 widths and max-width rules | No centralized breakpoint tokens | High | Consolidate breakpoint intent first; do not mechanically translate each media query to default `sm/md/lg`. |
| Reduced motion and keyframes | `constellation-label-in`, `orbit`, `prefers-reduced-motion` | Existing duration/easing plus GSAP runtime behavior | High | Keep custom CSS and runtime checks; verify reduced motion in both CSS and JS. |

No stylesheet should be deleted in this migration; once all active rules are moved, CSS extraction can be reconsidered based on what remains. The old component trees use many Tailwind utilities and custom variable names, but because they are currently unreachable they should not drive the active design token system without the owner’s decision.

## 11. Phased Migration Plan

### Phase 0 — Baseline and safety

- Capture current homepage, archive, one image-backed detail page, one placeholder detail page, and not-found at desktop/tablet/mobile widths.
- Record route output, current computed `:root` values, image aspect ratio, page gutters, and top-level section spacing.
- Record animation selectors: `#main-content > section`, `#layer-legacy`, `.project-record`, `.technical-flow`, `data-hover`, `--project-hover`, `--pointer-x`, `--pointer-y`, and `.experience-canvas`.
- Keep a rollback commit or branch before changing `app/globals.css`; avoid rewriting the entire file in one pass.
- Run lint, TypeScript, production build, and available route checks. There is no current test script or test suite.

### Phase 1 — Tailwind v4 foundation

- Keep existing `@import "tailwindcss"`, `@tailwindcss/postcss`, and `postcss.config.mjs`.
- Add the `@theme inline` bridge for real current tokens; do not add `tailwind.config.js` or v3 `content` settings.
- Verify generated color/font/spacing utilities with a small sample component and production CSS inspection.
- Leave the old `:root` custom properties intact as aliases during migration.
- Confirm `next/font` Poppins/Manrope variables resolve in the generated page and do not introduce external CSS imports.

### Phase 2 — Shared layout primitives

- Migrate `.page-wrap`, text colors, borders, common gaps, and button/link patterns where repeated.
- Ensure project navigation and site header keep accessible focus-visible styles and 44px/48px touch targets.
- Establish token-backed utilities for accent surfaces; replace the archive’s default `bg-lime-300`/`text-black!` with the exact portfolio accent/on-accent tokens only when visual comparison is available.

### Phase 3 — Low-risk page components

- Migrate `ProjectCard` and archive wrapper first; they are isolated and already partly utility styled.
- Compare card widths, equal heights, technology wrapping, and repository/detail links against baseline.
- Move to `ProjectPreview` and detail copy only after image sizing and no-image placeholder are verified.

### Phase 4 — Complex page sections

- Migrate homepage about/capabilities/journey/contact in separate changes.
- Then migrate work/project-record visuals and the hero. These have custom surface art, pseudo-elements, absolute positioning, and pointer focus; keep those portions in named CSS.
- Split `PortfolioPage.tsx` and content modules only as separate refactors, not in the same commit as utility replacement.

### Phase 5 — Animation-sensitive areas

- Keep `.project-record`, `.technical-flow`, section IDs, `data-hover`, and animation element structure unchanged while CSS is converted.
- Do not add transform/opacity utility classes to elements whose transform/opacity is controlled by GSAP.
- Keep R3F size/layering and `HeroMaterial.ts` shader/material definitions outside Tailwind.
- Verify GSAP cleanup, scroll focus, Lenis, pointer mapping, and project focus after each relevant component migration.

### Phase 6 — Responsive and accessibility validation

- Test at the existing 640/700/701/900/901/1200 boundaries before collapsing them into a smaller set.
- Check no horizontal overflow, text clipping, card/title wrapping, fixed constellation overlap, image shift, focus obscuration, contrast, and reduced-motion behavior.
- Confirm keyboard tab order, section anchors, skip link, `aria-current`, and native link behavior.

### Phase 7 — Dead CSS and dependency review

- Search each migrated class against active JSX and dynamic selectors; remove old rules only after the component is verified at all target widths.
- Resolve old `SystemOS` generation first. Then consider its dependent datasets, package imports, and public assets as one reviewed cleanup.
- Re-run CSS selector and package usage checks; do not infer safety from `npm ls` alone.

### Phase 8 — Final cleanup

- Run lint, TypeScript, production build, route smoke checks, and visual regression review.
- Inspect the diff for duplicate token values and residual utility/native declarations that now style the same property.
- Remove no package until its last static, dynamic, config, and postinstall/patch reference is verified.

## 12. Risk Register

| Risk | Likely failure | Prevention | Validation |
|---|---|---|---|
| Global CSS and Tailwind preflight | Element defaults/margins or utility specificity changes all routes. | Preserve baseline, migrate one group, avoid simultaneous reset cleanup. | Desktop/mobile screenshots and computed-style comparison for all routes. |
| Font variables | `font-*` aliases collide with current `--font-display`/`--font-body` variables or fallback order shifts. | Use non-colliding Tailwind aliases and keep `next/font` variables as the font source. | Inspect generated CSS and computed font on home/archive/detail. |
| Hero composition | Grid/absolute artwork, viewport heights, and responsive paddings shift the headline/canvas relationship. | Keep artwork CSS; migrate only text/layout tokens after baseline. | 1440px, tablet, 390px; reduced motion. |
| 3D canvas stacking | Canvas appears above content or hides links/focus. | Preserve z-index 0/content 1 and pointer-events behavior as named tokens only after verification. | Keyboard focus, pointer interaction, WebGL fallback, reduced motion. |
| GSAP selectors and transforms | Selector rename or utility transform overrides kill reveals/focus or leave elements translated. | Preserve selector contract; separate animated and layout wrappers if required. | Scroll all homepage chapters, hover/focus project record, resize, reduced motion. |
| Scroll and pointer buses | Duplicate or changed listeners alter section/current project state. | Do not conflate `useActiveSection` and `ScrollBus`; keep cleanup and event ownership. | Scroll anchors and observe active label/focused project. |
| Hydration-sensitive client code | Server/client render diverges if browser state moves into render. | Keep capability checks in effects; retain static server markup and dynamic `ssr:false` boundary. | Production build plus browser console/hydration scan. |
| Project-detail layout | Utility changes collapse hero columns, image ratio, sticky aside, or generated routes. | Preserve `generateStaticParams`, preview ratio, and mobile stacking. | All 11 routes plus one placeholder and image-backed page at each breakpoint. |
| Tailwind scan/source detection | Dynamic string-built classes are omitted; orphan source still generates unused utilities. | Use complete literal class names and review generated CSS output. | Build CSS inspection; no safelist unless genuinely required. |
| R3F patch | Package upgrade makes the patch fail or patched timer semantics change. | Pin compatible version; review patch and test canvas lifecycle on upgrades. | `postinstall`, production build, mount/unmount and tab visibility. |
| Global/runtime scope | Canvas and orchestrator mount on archive/detail routes where section selectors do not match. | Decide whether the canvas is intentionally global before moving it to a route layout. | Compare all routes and inspect CPU/network bundle/runtime behavior. |
| Source-of-truth drift | New `data/projects` copy conflicts with `projectSystems` homepage graph content. | Keep graph topology separate and join by stable project ID. | Catalog/detail/home content consistency assertions or a small test. |

## 13. Prioritized Implementation Roadmap

| Priority | Objective | Files / components | Prerequisites | Benefit | Risk / effort | Dependencies / acceptance criteria |
|---|---|---|---|---|---|---|
| P0 | Decide whether old OS UI remains a supported experience. | `components/os/`, `components/visualizations/`, related `components/ui/`, `system/layers.ts`, old `lib/content.ts` exports | Product/history decision | Prevent wasted work migrating unreachable UI and identify valid cleanup scope. | Medium risk / small effort | No files deleted until route/history check; decision recorded. |
| P0 | Make project metadata ownership explicit. | `data/projects/*.ts`, `lib/content.ts`, `PortfolioPage.tsx`, `ExperienceCanvas.tsx` | Identify unique graph data vs display copy | Avoid home/archive/detail inconsistencies. | Medium / medium | One canonical title/summary/stack/role per project; architecture graph remains keyed by valid IDs. |
| P0 | Update stale architecture/asset docs. | `README.md`, `docs/architecture.md`, `docs/design-tokens.md`, `public/images/projects/README.md`, `CLAUDE.md`, `.cursorrules` | Old-tree decision; font and asset workflow confirmed | Prevent refactors using retired page architecture and incorrect styles. | Low / small | Each doc names current page entry, client boundary, fonts, screenshot folder, and real styling constraints. |
| P1 | Add CSS-first Tailwind v4 token aliases without visual changes. | `app/globals.css`, possibly `ProjectCard.tsx` for verification | Baseline capture | Establish one bridge from current variables to utilities. | Medium / medium | Generated utilities use exact current colors/fonts; no route screenshot drift. |
| P1 | Migrate and verify project card/archive styling. | `ProjectCard.tsx`, `.catalog-*`, `app/projects/page.tsx` | Token bridge | Low-risk proof of the migration workflow. | Low-medium / medium | Cards match baseline, touch/focus state preserved, build/lint pass. |
| P1 | Create baseline route/viewport visual checks. | `/`, `/projects`, `/projects/[id]`, not found | Browser/Playwright runtime available | Makes later migration measurable. | Low / small | Desktop/tablet/mobile snapshots and console/hydration baseline recorded. |
| P2 | Migrate project-detail and shared section layout. | `ProjectDetail.tsx`, `ProjectPreview.tsx`, detail selectors | Card migration complete | Reduce native CSS for routine grids/spacing while preserving detail layout. | Medium / medium | All 11 generated routes checked; preview ratio and responsive stack match. |
| P2 | Split homepage sections and active content modules. | `PortfolioPage.tsx`, `lib/content.ts`, `components/portfolio/` | P0 content ownership | Reduce high-responsibility files without adding client boundaries. | Medium / medium | Server sections remain server-rendered; no duplicated data; imports acyclic. |
| P2 | Migrate straightforward home sections. | About, capabilities, journey, contact groups in `PortfolioPage.tsx`/new sections | Token and route baseline | Bring common layout into utilities. | Medium / medium | Anchor IDs and motion selectors unchanged; responsive/accessibility checks pass. |
| P3 | Migrate hero and architecture visuals selectively. | Hero/work CSS, `ExperienceCanvas`, material and GSAP integration | Earlier migrations and visual proof | Complete high-visibility migration with animation intact. | High / large | Motion, WebGL, fallback, reduced motion, pointer focus all match baseline. |
| P3 | Remove verified old-tree/dependency/assets candidates. | Candidate files/dependencies in §7 | Explicit retirement decision | Reduce maintenance and unused bundle/build surface. | Medium / medium | Full static/runtime/direct-URL check; no retained import/config/patch consumer; tests/build pass. |

## 14. Validation Results

| Check | Result | Notes |
|---|---|---|
| `npm.cmd run lint` | **Passed** | ESLint completed successfully. |
| `npx.cmd tsc --noEmit --incremental false` | **Passed** | Strict TypeScript check; disabled incremental cache output. |
| Production build | **Not rerun** | The isolated attempt `npm.cmd run build -- --dist-dir .next-audit-temp` failed because Next 16.2.10’s `next build` CLI does not accept `--dist-dir`. A normal build would overwrite the existing ignored `.next/` output; it was not run to preserve the working state. |
| Test suite | **Not available** | `package.json` has no test script and no repository test files were found. |
| Route/browser/visual inspection | **Not run** | This was a read-only architecture audit. Browser/Playwright screenshot tooling was not available in the previous environment; no visual claims are made here. |
| Git working tree | **Preserved** | Existing uncommitted edits to `app/globals.css`, project records, `ProjectDetail.tsx`, and `types/project.ts`, plus the untracked `public/images/projects/anime/image.png` asset, were left untouched. This report is the only repository file created for this audit. |

## 15. Unresolved Questions and Limitations

1. Is `components/os/SystemOS.tsx` a retired experience, an alternate design to preserve, or intended for a future route? This decision gates the largest candidate cleanup and its package/data dependencies.
2. Should the experience canvas intentionally remain mounted on `/projects` and every project-detail route, or is it a homepage-only visual?
3. Which project values in `lib/content.ts` are still authoritative when they differ from `data/projects/*.ts`? The code has duplicate representations; this audit does not rewrite project facts.
4. Is `public/projects/user-management-pro.png` retained for an upcoming project, or is it an orphaned asset? Direct external URL use cannot be ruled out by local source search.
5. `graphify-out/graph.json` and `graph.html` were not regenerated. The graph query returned a non-existent `hooks/useInView.ts` source node, so those outputs remain stale.
6. `.env*`, `.git/`, `node_modules/`, `.next/`, and generated graph/build outputs were not treated as ordinary source. Environment variable contents were not opened. Assets were inventoried by path/size/reference rather than visually reviewed.
7. Static search cannot prove the absence of dynamically assembled selectors, externally injected HTML, direct public-asset links, or deployment-only references. Candidate-unused findings therefore require a final history/runtime check before deletion.

The report is an audit and migration blueprint only. It does not authorize deletion, dependency removal, styling migration, route changes, or source refactoring.

---
type: "query"
date: "2026-10-15T11:31:52.486685+00:00"
question: "Audit repository leftovers and trace the current knowledge graph integration"
contributor: "graphify"
outcome: "useful"
source_nodes: ["KnowledgeGraph()", "SystemOS()", "TechMap()", "CircuitTrace()"]
---

# Q: Audit repository leftovers and trace the current knowledge graph integration

## Answer

Expanded query tokens from graph vocabulary: knowledgegraph, systemos, archflow, circuittrace, lightrays, tiltedcard, techmap. The graph snapshot links the old OS and visualization components to content.ts; source locations include components/os/SystemOS.tsx, components/visualizations/TechMap.tsx, components/visualizations/CircuitTrace.tsx, and components/visualizations/KnowledgeGraph.tsx. The graph snapshot predates the current CapabilitiesSection import. Live source search confirmed KnowledgeGraph is active and the retired components have no active route/import entry point.

## Outcome

- Signal: useful

## Source Nodes

- KnowledgeGraph()
- SystemOS()
- TechMap()
- CircuitTrace()
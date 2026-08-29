export interface Layer {
  id:       string
  index:    number      // 1-based display number
  codename: string      // display name in navigator
  anchor:   string      // DOM id
}

export const LAYERS: Layer[] = [
  { id: 'core',         index: 1, codename: 'CORE',         anchor: 'layer-core' },
  { id: 'memory',       index: 2, codename: 'MEMORY',       anchor: 'layer-memory' },
  { id: 'knowledge',    index: 3, codename: 'KNOWLEDGE',    anchor: 'layer-knowledge' },
  { id: 'systems',      index: 4, codename: 'SYSTEMS',      anchor: 'layer-systems' },
  { id: 'process',      index: 5, codename: 'PROCESS',      anchor: 'layer-process' },
  { id: 'intelligence', index: 6, codename: 'INTELLIGENCE', anchor: 'layer-intelligence' },
  { id: 'legacy',       index: 7, codename: 'LEGACY',       anchor: 'layer-legacy' },
]

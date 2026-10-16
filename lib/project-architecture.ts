export type ArchitectureNode = {
  id: string
  label: string
  role: string
  status: 'running' | 'idle' | 'pending'
  color?: string
}

export type ArchitectureEdge = {
  from: string
  to: string
  label?: string
  type: 'sync' | 'async' | 'event' | 'data'
}

export type ProjectArchitecture = {
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
}

export const projectArchitectures = {
  atlashr: {
    nodes: [
      { id: 'backend', label: 'Spring Boot', role: 'Backend services', status: 'running', color: '#6db33f' },
      { id: 'dashboard', label: 'Next.js', role: 'Web dashboard', status: 'running', color: '#e2e8f0' },
      { id: 'db', label: 'PostgreSQL', role: 'Database', status: 'running', color: '#4169e1' },
    ],
    edges: [],
  },
  'onee-sys': {
    nodes: [
      { id: 'ui', label: 'Blade UI', role: 'Web views', status: 'running', color: '#ff2d20' },
      { id: 'app', label: 'Laravel', role: 'Application logic', status: 'running', color: '#6db33f' },
      { id: 'db', label: 'SQLite', role: 'Database', status: 'running', color: '#76e4f7' },
    ],
    edges: [
      { from: 'ui', to: 'app', type: 'sync', label: 'request' },
      { from: 'app', to: 'db', type: 'data', label: 'query' },
    ],
  },
  innovex: {
    nodes: [
      { id: 'web', label: 'Next.js', role: 'Event explorer', status: 'running', color: '#e2e8f0' },
      { id: 'auth', label: 'NextAuth', role: 'Authentication', status: 'running', color: '#9f7aea' },
      { id: 'orm', label: 'Prisma', role: 'Data access', status: 'running', color: '#5a67d8' },
      { id: 'db', label: 'PostgreSQL', role: 'Database', status: 'running', color: '#4169e1' },
    ],
    edges: [
      { from: 'web', to: 'auth', type: 'sync', label: 'session' },
      { from: 'web', to: 'orm', type: 'sync', label: 'query' },
      { from: 'orm', to: 'db', type: 'data', label: 'SQL' },
    ],
  },
  homely: {
    nodes: [
      { id: 'mobile', label: 'Flutter', role: 'Mobile app', status: 'pending', color: '#54c5f8' },
      { id: 'api', label: 'Spring Boot', role: 'Backend API', status: 'pending', color: '#6db33f' },
      { id: 'admin', label: 'React', role: 'Admin dashboard', status: 'pending', color: '#61dafb' },
      { id: 'db', label: 'PostgreSQL', role: 'Database', status: 'pending', color: '#4169e1' },
    ],
    edges: [],
  },
} satisfies Record<string, ProjectArchitecture>

export function getProjectArchitecture(projectId: string): ProjectArchitecture | undefined {
  return projectArchitectures[projectId as keyof typeof projectArchitectures]
}

export function assertProjectArchitectureReferences(projectIds: ReadonlySet<string>) {
  for (const [projectId, architecture] of Object.entries(projectArchitectures)) {
    if (!projectIds.has(projectId)) {
      throw new Error(`Architecture references unknown project "${projectId}".`)
    }

    const nodeIds = new Set(architecture.nodes.map(node => node.id))
    if (nodeIds.size !== architecture.nodes.length) {
      throw new Error(`Architecture for "${projectId}" contains duplicate node IDs.`)
    }

    for (const edge of architecture.edges) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
        throw new Error(`Architecture for "${projectId}" has an edge with an unknown node.`)
      }
    }
  }
}

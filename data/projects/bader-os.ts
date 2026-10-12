import type { Project } from '@/types/project'

const project: Project = {
  id: 'bader-os', title: 'bader.os', category: 'Personal portfolio',
  summary: 'An operating-system-inspired portfolio that makes engineering work and its connections explorable.',
  description: 'A personal engineering portfolio presented as a layered operating system, with project architecture diagrams, a technology knowledge graph, a learning timeline, and an interactive 3D environment.',
  technologies: ['Next.js', 'TypeScript', 'React', 'Three.js', 'GSAP', 'D3', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/bader.os',
  status: 'in-progress', featured: false,
  highlights: ['Seven portfolio layers organize projects, skills, and experience.', 'Architecture diagrams and technology maps connect tools and projects.'],
  features: ['Interactive engineering portfolio.', 'Project system maps.', 'Technology knowledge graph.', 'Experience timeline.'],
  architecture: ['Next.js App Router with React Server Components.', 'Three.js via React Three Fiber, GSAP animation, and D3 visualizations.'],
  images: [],
}
export default project

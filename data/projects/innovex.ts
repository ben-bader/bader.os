import type { Project } from '@/types/project'

const project: Project = {
  id: 'innovex', title: 'Innovex', category: 'Full-stack web application',
  summary: 'A Next.js application for discovering technology events and saving favorites.',
  description: 'A full-stack Next.js application for discovering technology events, creating an account, and saving favorite events.',
  technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NextAuth.js', 'Prisma', 'PostgreSQL', 'Framer Motion'], repositoryUrl: 'https://github.com/ben-bader/Innovex',
  featured: false,
  highlights: ['Event discovery with user accounts and saved favorites.', 'Prisma data access with PostgreSQL.'],
  features: ['Browse technology events.', 'Create accounts and sign in.', 'Save and manage favorite events.'],
  architecture: ['Next.js application with Prisma data access and PostgreSQL.', 'NextAuth.js authentication.'],
  images: [],
}
export default project

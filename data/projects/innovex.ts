import type { Project } from '@/types/project'

const project: Project = {
  id: 'innovex', title: 'Innovex', category: 'Full-stack web application',
  summary: 'A Next.js application for discovering technology events and saving favorites.',
  description: 'A Next.js event explorer for browsing technology events, creating an account, and saving favorites, with Prisma data access and PostgreSQL persistence.',
  technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NextAuth.js', 'Prisma', 'PostgreSQL', 'Framer Motion'], repositoryUrl: 'https://github.com/ben-bader/Innovex',
  status: 'completed', period: '2024-2025',
  featured: false,
  highlights: ['Event browsing is paired with accounts and saved favorites.', 'Prisma connects the application to PostgreSQL.'],
  features: ['Browse technology events.', 'Create accounts and sign in.', 'Save and manage favorite events.'],
  architecture: ['Next.js application with NextAuth.js account access and Prisma data access to PostgreSQL.'],
  implementation: [
    { technology: 'Next.js and TypeScript', detail: 'The application interface and routes are built with the Next.js framework and typed with TypeScript.' },
    { technology: 'NextAuth.js', detail: 'Provides account sign-in for event users.' },
    { technology: 'Prisma and PostgreSQL', detail: 'Prisma is the data-access layer for the PostgreSQL-backed event and favorite records.' },
    { technology: 'Tailwind CSS', detail: 'Styles the application interface.' },
  ],
  images: [{ src: '/images/projects/innovex/image.png', alt: 'Innovex technology event landing page' }],
}
export default project

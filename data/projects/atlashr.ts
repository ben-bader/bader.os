import type { Project } from '@/types/project'

const project: Project = {
  id: 'atlashr', title: 'AtlasHR', category: 'HR management',
  summary: 'An HR management platform with Spring Boot backend services and a Next.js dashboard.',
  description: 'AtlasHR is a human resources platform I worked on during my full-stack internship at 2SIS Technologies. My contributions spanned backend services, REST APIs, PostgreSQL data work, and a Next.js dashboard.',
  technologies: ['Spring Boot', 'Next.js', 'PostgreSQL', 'REST APIs','Java','Docker','Microservices','Git'], repositoryUrl: null,
  status: 'completed', period: '2026',
  featured: true,
  highlights: ['Backend and dashboard work were part of the same HR platform.', 'Contributions spanned service, API, database, and interface work.'],
  features: ['Human resources management platform.', 'Backend services with REST APIs.', 'Next.js dashboard.'],
  architecture: ['Spring Boot backend services and a Next.js dashboard form the application areas covered by my work, with PostgreSQL data work supporting the platform.'],
  implementation: [
    { technology: 'Spring Boot', detail: 'Used for backend service development during the internship.' },
    { technology: 'REST APIs', detail: 'API development connected to the backend work.' },
    { technology: 'PostgreSQL', detail: 'The internship record lists work with the project data layer.' },
    { technology: 'Next.js', detail: 'Used for the web dashboard.' },
  ],
  role: 'Contributed to Spring Boot backend services, REST APIs, PostgreSQL integration, and the Next.js dashboard as part of the 2SIS Technologies internship team.',
  images: [{ src: '/images/projects/atlas-hr/image.png', alt: 'AtlasHR analytics dashboard interface' }],
}
export default project

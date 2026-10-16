import type { Project } from '@/types/project'

const project: Project = {
  id: 'homely', title: 'Homely', category: 'Academic real-estate platform',
  summary: 'A team-designed real-estate platform for listings, messaging, and administration.',
  description: 'Homely is a final-year team project designed around property listings, seller messaging, and administration. Its system design connects Flutter mobile clients and a React dashboard to a Spring Boot REST API, with PostgreSQL for persistence.',
  technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Flutter', 'Dart', 'React', 'JWT'], repositoryUrl: 'https://github.com/ben-bader/Homely',
  status: 'completed', period: '2024-2025',
  featured: false,
  highlights: ['The project design spans mobile clients, an API, and an administration dashboard.', 'Developed as a three-student final-year team project.'],
  features: ['Property browsing and listing management.', 'Seller messaging and visit requests.', 'Listing boosts.', 'Administration and report management.'],
  architecture: ['Flutter mobile clients and a React admin dashboard connect to a Spring Boot REST API.', 'PostgreSQL stores platform data; JWT protects API requests.'],
  implementation: [
    { technology: 'Flutter and Dart', detail: 'Build the mobile clients in the system design.' },
    { technology: 'React', detail: 'Builds the administration dashboard.' },
    { technology: 'Spring Boot and Java', detail: 'Provide the REST API that serves the mobile clients and dashboard.' },
    { technology: 'PostgreSQL', detail: 'Stores platform data for the API.' },
    { technology: 'JWT', detail: 'Protects authenticated API requests.' },
  ],
  role: 'My assigned contribution focused on the backend and PostgreSQL data layer.',
  team: 'Built by a three-student team with backend, mobile, and administration dashboard responsibilities.',
  images: [{ src: '/images/projects/homely/image.png', alt: 'Homely property platform administration dashboard' }],
}
export default project

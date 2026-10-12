import type { Project } from '@/types/project'

const project: Project = {
  id: 'homely', title: 'Homely', category: 'Academic real-estate platform',
  summary: 'A real-estate platform for property listings, messaging, and administration.',
  description: 'Homely is a final-year team project combining Flutter mobile apps, a React administration dashboard, and a Spring Boot REST API with PostgreSQL persistence.',
  technologies: ['Java', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'Flutter', 'Dart', 'React', 'Axios', 'JWT'], repositoryUrl: 'https://github.com/ben-bader/Homely',
  featured: false,
  highlights: ['Mobile apps and an administration dashboard connect to a central REST API.', 'Developed as a final-year team project.'],
  features: ['Property browsing and listings.', 'Seller messaging and visit requests.', 'Listing boosts.', 'Administration and report management.'],
  architecture: ['Flutter mobile apps and a React admin dashboard communicate with a Spring Boot API.', 'PostgreSQL persistence and JWT-protected API requests.'],
  role: 'Worked on the Spring Boot backend and PostgreSQL data layer.',
  team: 'Built by a three-student team with backend, mobile, and administration dashboard responsibilities.', images: [],
}
export default project

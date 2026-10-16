import type { Project } from '@/types/project'

const project: Project = {
  id: 'onee-sys', title: 'ONEE-SYS', category: 'Inventory management',
  summary: 'A Laravel application for recording equipment, peripherals, brands, employees, and sites.',
  description: 'An internal inventory application for recording devices and peripherals alongside their brands, categories, assigned employees, and sites. Laravel serves the application, Blade renders its pages, and SQLite stores its records.',
  technologies: ['Laravel', 'PHP', 'Blade', 'SQLite', 'Vite'], repositoryUrl: 'https://github.com/ben-bader/ONEE-SYS',
  status: 'completed', period: '2025',
  featured: true,
  highlights: ['Equipment records relate to brands, categories, employees, and sites.', 'Delivered as an internal tool during an internship at ONEE - Branche Eau.'],
  features: ['Create, edit, and remove inventory records.', 'Manage brands, categories, employees, and sites.', 'Search and paginate inventory listings.'],
  architecture: ['Laravel MVC application with Blade views and SQLite storage.', 'Vite bundles the frontend assets used by the Blade interface.'],
  implementation: [
    { technology: 'Laravel / PHP', detail: 'The MVC application handles inventory workflows and related records; the internship role included CRUD work.' },
    { technology: 'Blade', detail: 'Renders the server-side application views for the inventory interface.' },
    { technology: 'SQLite', detail: 'Stores the inventory and related record data through the application database.' },
    { technology: 'Vite', detail: 'Bundles frontend assets for the Blade-based application.' },
  ],
  role: 'Worked with the engineering team on Laravel MVC, CRUD operations, and the first production release during an internship at ONEE - Branche Eau.',
  images: [{ src: '/images/projects/onee-sys/image.png', alt: 'ONEE digital platform landing page' }],
}
export default project

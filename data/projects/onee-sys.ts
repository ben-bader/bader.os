import type { Project } from '@/types/project'

const project: Project = {
  id: 'onee-sys', title: 'ONEE-SYS', category: 'Inventory management',
  summary: 'A Laravel application for recording equipment, peripherals, brands, employees, and sites.',
  description: 'An internal inventory management application for tracking equipment, peripherals, brands, employees, and sites, built with Laravel, Blade, and SQLite.',
  technologies: ['Laravel', 'PHP', 'Blade', 'SQLite', 'Vite'], repositoryUrl: 'https://github.com/ben-bader/ONEE-SYS',
  featured: true,
  highlights: ['Inventory records connect equipment with brands, employees, and sites.', 'Built as an internal tool for ONEE - Branche Eau.'],
  features: ['Manage devices and peripherals.', 'Track brands and categories.', 'Assign equipment to employees and sites.', 'Search and paginate inventory records.'],
  architecture: ['Laravel MVC application using Blade views and SQLite.', 'Vite builds frontend assets.'],
  role: 'Worked with the engineering team on Laravel MVC, CRUD operations, and the first production release during an internship at ONEE - Branche Eau.',
  images: [],
}
export default project

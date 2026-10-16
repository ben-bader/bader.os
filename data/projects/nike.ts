import type { Project } from '@/types/project'

const project: Project = {
  id: 'nike', title: 'Nike Landing Page', category: 'Frontend interface',
  summary: 'A responsive Nike-inspired product landing page made with React and Tailwind CSS.',
  description: 'A responsive Nike-inspired product landing page with animated interface interactions, built as a React frontend.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/Nike',
  status: 'prototype', featured: false,
  highlights: ['Responsive landing-page layout with motion effects.'],
  features: ['Product-focused landing-page presentation.', 'Responsive layout and interface transitions.'],
  architecture: ['React frontend bundled with Vite.'],
  implementation: [
    { technology: 'React', detail: 'Composes the product landing page and its interactive interface.' },
    { technology: 'Vite', detail: 'Runs and bundles the React frontend.' },
    { technology: 'Tailwind CSS', detail: 'Styles the responsive page layout and components.' },
  ],
  images: [{ src: '/images/projects/nike/image.png', alt: 'Nike-inspired product landing page' }],
}
export default project

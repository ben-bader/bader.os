import type { Project } from '@/types/project'

const project: Project = {
  id: 'nike', title: 'Nike Landing Page', category: 'Frontend interface',
  summary: 'A responsive Nike-inspired product landing page made with React and Tailwind CSS.',
  description: 'A responsive Nike-inspired product landing page with animated interface interactions, built with React and Tailwind CSS.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/Nike',
  status: 'prototype', featured: false,
  highlights: ['Responsive landing-page layout with motion effects.'],
  features: ['Product-focused landing-page presentation.', 'Responsive layout and interface transitions.'],
  architecture: ['React frontend bundled with Vite.'],
  images: [{ src: '/projects/nike.png', alt: 'Nike-inspired product landing page' }],
}
export default project

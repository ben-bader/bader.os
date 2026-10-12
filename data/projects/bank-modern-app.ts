import type { Project } from '@/types/project'

const project: Project = {
  id: 'bank-modern-app', title: 'Modern Bank App', category: 'Frontend interface',
  summary: 'A responsive banking landing page built with React, Vite, and Tailwind CSS.',
  description: 'A responsive banking landing page built from reusable React components, with layouts for desktop, tablet, and mobile screens.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/Bank-Modern-APP',
  status: 'prototype', featured: false,
  highlights: ['Responsive bank landing-page interface.', 'Reusable React UI components.'],
  features: ['Responsive presentation for desktop, tablet, and mobile.', 'Reusable React UI components.'],
  architecture: ['Single-page React frontend bundled with Vite.'],
  images: [{ src: '/projects/bank-modern-app.png', alt: 'Responsive modern banking landing page' }],
}
export default project

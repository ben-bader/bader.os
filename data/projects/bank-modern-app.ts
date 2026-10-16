import type { Project } from '@/types/project'

const project: Project = {
  id: 'bank-modern-app', title: 'Modern Bank App', category: 'Frontend interface',
  summary: 'A responsive banking landing page built with React, Vite, and Tailwind CSS.',
  description: 'A responsive banking landing-page interface composed from React components and styled for desktop, tablet, and mobile screens.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/Bank-Modern-APP',
  status: 'prototype', featured: false,
  highlights: ['Responsive bank landing-page interface.', 'Reusable React UI components.'],
  features: ['Responsive presentation for desktop, tablet, and mobile.', 'Reusable React UI components.'],
  architecture: ['Single-page React frontend bundled with Vite.'],
  implementation: [
    { technology: 'React', detail: 'Composes the banking page from reusable interface components.' },
    { technology: 'Vite', detail: 'Runs and bundles the client-side React application.' },
    { technology: 'Tailwind CSS', detail: 'Provides the utility-based styling used to shape the responsive page.' },
  ],
  images: [{ src: '/images/projects/bank-modern-app/image.png', alt: 'Responsive modern banking landing page' }],
}
export default project

import type { Project } from '@/types/project'

const project: Project = {
  id: 'zentry', title: 'Zentry Clone', category: 'Frontend interface',
  summary: 'A responsive landing-page recreation using React, Tailwind CSS, and GSAP.',
  description: 'A responsive recreation of Zentry’s landing page, built as a React frontend with Tailwind CSS styling and GSAP-powered motion.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'GSAP'], repositoryUrl: 'https://github.com/ben-bader/Zentry',
  status: 'prototype', featured: false,
  highlights: ['GSAP motion effects.', 'Responsive landing-page composition.'],
  features: ['Responsive landing-page composition.', 'Animated interface elements.'],
  architecture: ['React frontend bundled with Vite.'],
  implementation: [
    { technology: 'React', detail: 'Composes the landing page from frontend components.' },
    { technology: 'Vite', detail: 'Runs and bundles the React application.' },
    { technology: 'Tailwind CSS', detail: 'Styles the responsive landing-page layout.' },
    { technology: 'GSAP', detail: 'Drives the landing page’s interface animations.' },
  ],
  images: [{ src: '/images/projects/zentry/image.png', alt: 'Responsive Zentry-inspired landing page' }],
}
export default project

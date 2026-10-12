import type { Project } from '@/types/project'

const project: Project = {
  id: 'zentry', title: 'Zentry Clone', category: 'Frontend interface',
  summary: 'A responsive landing-page recreation using React, Tailwind CSS, and GSAP.',
  description: 'A responsive recreation of Zentry’s landing page, with GSAP-powered motion and a React, Tailwind CSS, and Vite frontend.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'GSAP'], repositoryUrl: 'https://github.com/ben-bader/Zentry',
  status: 'prototype', featured: false,
  highlights: ['GSAP motion effects.', 'Responsive landing-page composition.'],
  features: ['Responsive landing-page composition.', 'Animated interface elements.'],
  architecture: ['React frontend bundled with Vite.'],
  images: [{ src: '/projects/zentry.png', alt: 'Responsive Zentry-inspired landing page' }],
}
export default project

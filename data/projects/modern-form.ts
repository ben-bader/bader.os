import type { Project } from '@/types/project'

const project: Project = {
  id: 'modern-form', title: 'Modern Form', category: 'Frontend component',
  summary: 'A responsive authentication form interface with login and signup modes.',
  description: 'A responsive React form interface that switches between login and signup modes and validates user input on the client.',
  technologies: ['React', 'JavaScript', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/Modern-Form',
  status: 'prototype', featured: false,
  highlights: ['Login and signup states share one responsive form interface.'],
  features: ['Toggle between login and signup modes.', 'Basic input validation.', 'Responsive presentation.'],
  architecture: ['Single-page React interface with local component state.'],
  images: [{ src: '/projects/modern-form.png', alt: 'Responsive login and signup form interface' }],
}
export default project

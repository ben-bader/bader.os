import type { Project } from '@/types/project'

const project: Project = {
  id: 'modern-form', title: 'Modern Form', category: 'Frontend component',
  summary: 'A responsive authentication form interface with login and signup modes.',
  description: 'A responsive React authentication form prototype with login and signup modes and basic client-side input validation.',
  technologies: ['React', 'JavaScript', 'Tailwind CSS'], repositoryUrl: 'https://github.com/ben-bader/Modern-Form',
  status: 'prototype', featured: false,
  highlights: ['Login and signup states share one responsive form interface.'],
  features: ['Toggle between login and signup modes.', 'Basic input validation.', 'Responsive presentation.'],
  architecture: ['Single-page React interface with local component state.'],
  implementation: [
    { technology: 'React', detail: 'Renders the form and switches between its login and signup modes.' },
    { technology: 'JavaScript', detail: 'Handles the interactive form behavior and basic client-side validation.' },
    { technology: 'Tailwind CSS', detail: 'Styles the responsive form interface.' },
  ],
  images: [{ src: '/images/projects/modern-form/image.png', alt: 'Responsive login and signup form interface' }],
}
export default project

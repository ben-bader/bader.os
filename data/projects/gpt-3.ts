import type { Project } from '@/types/project'

const project: Project = {
  id: 'gpt-3', title: 'GPT-3', category: 'Frontend interface',
  summary: 'A responsive chatbot interface concept built with React and Vite.',
  description: 'A responsive frontend concept for a GPT-inspired chat interface, built with React and Vite. The project presents the chat experience as a user interface.',
  technologies: ['React', 'JavaScript', 'Vite', 'CSS'], repositoryUrl: 'https://github.com/ben-bader/GPT-3',
  status: 'prototype', featured: false,
  highlights: ['Responsive layout for a chatbot-style interface.'],
  features: ['GPT-inspired chat interface concept.'],
  architecture: ['React frontend bundled with Vite.'],
  implementation: [
    { technology: 'React', detail: 'Renders the chatbot-style interface as a client-side application.' },
    { technology: 'Vite', detail: 'Runs and bundles the React frontend.' },
    { technology: 'CSS', detail: 'Styles the responsive chat interface.' },
  ],
  images: [{ src: '/images/projects/gpt3/image.png', alt: 'GPT-3 interface concept landing page with an email sign-up form' }],
}
export default project

import type { Project } from '@/types/project'

const project: Project = {
  id: 'anime', title: 'Anime World', category: 'Web application',
  summary: 'An anime-themed site with basic registration, login, and a landing page.',
  description: 'An anime-themed PHP website with registration and login pages and a landing page shown after sign-in.',
  technologies: ['PHP', 'HTML', 'CSS', 'JavaScript'], repositoryUrl: 'https://github.com/ben-bader/Anime',
  status: 'prototype', featured: false,
  highlights: ['The project covers registration, login, and a post-login landing page.'],
  features: ['Registration and login forms.', 'Anime-themed landing page.'],
  architecture: ['PHP pages form the website, with HTML, CSS, JavaScript, and image assets for its interface.'],
  implementation: [
    { technology: 'PHP', detail: 'Handles the site’s registration and login flow.' },
    { technology: 'HTML and CSS', detail: 'Structure and style the registration, login, and landing pages.' },
    { technology: 'JavaScript', detail: 'Adds client-side interactions to the interface.' },
  ],
  images: [{ src: '/images/projects/anime/image.png', alt: 'Anime World landing page with sign-up and login actions' }],
}
export default project

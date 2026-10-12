import type { Project } from '@/types/project'

const project: Project = {
  id: 'anime', title: 'Anime World', category: 'Web application',
  summary: 'An anime-themed site with basic registration, login, and a landing page.',
  description: 'An anime-themed web application with registration and login screens alongside a post-login landing page, built with PHP, HTML, CSS, and JavaScript.',
  technologies: ['PHP', 'HTML', 'CSS', 'JavaScript'], repositoryUrl: 'https://github.com/ben-bader/Anime',
  status: 'prototype', featured: false,
  highlights: ['Separate registration, login, and post-login landing page experiences.'],
  features: ['Registration and login forms.', 'Client-side interface interactions on the main page.'],
  architecture: ['PHP handlers and pages with static HTML, CSS, JavaScript, and image assets.'],
  images: [],
}
export default project

import type { Project } from '@/types/project'

const project: Project = {
  id: 'film-app', title: 'Film App', category: 'Movie discovery web app',
  summary: 'A movie discovery app for browsing popular films and tracking trending searches.',
  description: 'A React movie discovery app that loads popular films from TMDB, supports debounced movie search, and ranks trending queries using search counts stored in Appwrite.',
  technologies: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'TMDB API', 'Appwrite'], repositoryUrl: 'https://github.com/ben-bader/Film-app',
  status: 'prototype', featured: false,
  highlights: ['Movie data and search results come from TMDB.', 'Appwrite search counts power a trending movies list.'],
  features: ['Browse popular movies.', 'Search movies with debounced input.', 'View movie posters, ratings, release years, and original languages.', 'Show the five most searched movies.'],
  architecture: ['React frontend bundled with Vite.', 'TMDB provides movie discovery and search data; Appwrite stores search counts and poster details for trending results.'],
  implementation: [
    { technology: 'React and JavaScript', detail: 'Render the movie discovery interface and manage search, loading, and result state.' },
    { technology: 'Vite', detail: 'Runs and bundles the React application.' },
    { technology: 'Tailwind CSS', detail: 'Styles the responsive movie interface.' },
    { technology: 'TMDB API', detail: 'Provides popular movie listings and movie search results.' },
    { technology: 'Appwrite', detail: 'Stores search counts and poster data used to rank trending movies.' },
  ],
  images: [{ src: '/images/projects/film-app/image.png', alt: 'Film App movie discovery page with search and movie listings' }],
}
export default project

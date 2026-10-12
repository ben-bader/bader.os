import type { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:             'https://baderbennani.dev',
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1,
    },
    { url: 'https://baderbennani.dev/projects', changeFrequency: 'monthly', priority: 0.8 },
    ...getAllProjects().map(project => ({
      url: `https://baderbennani.dev/projects/${project.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

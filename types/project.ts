export type ProjectStatus = 'prototype' | 'in-progress'

export interface Project {
  id: string
  title: string
  summary: string
  description: string
  category: string
  technologies: string[]
  repositoryUrl: string | null
  liveUrl?: string | null
  documentationUrl?: string | null
  status?: ProjectStatus
  featured: boolean
  highlights: string[]
  features: string[]
  architecture?: string[]
  challenges?: string[]
  learnings?: string[]
  role?: string
  team?: string
  images: { src: string; alt: string }[]
}

export type ProjectStatus = 'prototype' | 'in-progress' | 'completed'

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
  period?: string
  featured: boolean
  highlights: string[]
  features: string[]
  architecture?: string[]
  implementation?: { technology: string; detail: string }[]
  challenges?: string[]
  learnings?: string[]
  role?: string
  team?: string
  images: { src: string; alt: string }[]
}

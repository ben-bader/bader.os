import { projects } from '@/data/projects'
import type { Project } from '@/types/project'

export function getAllProjects(): Project[] {
  return [...projects]
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured)
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id)
}

export function getAllProjectIds(): string[] {
  return projects.map(project => project.id)
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetail from '@/components/projects/ProjectDetail'
import { getAllProjects, getAllProjectIds, getProjectById } from '@/lib/projects'

type ProjectRouteProps = { params: Promise<{ id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjectIds().map(id => ({ id }))
}

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const { id } = await params
  const project = getProjectById(id)
  if (!project) return { title: 'Project not found' }
  return { title: project.title, description: project.summary }
}

export default async function ProjectPage({ params }: ProjectRouteProps) {
  const { id } = await params
  const project = getProjectById(id)
  if (!project) notFound()
  return <ProjectDetail project={project} allProjects={getAllProjects()} />
}

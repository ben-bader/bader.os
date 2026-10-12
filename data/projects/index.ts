import type { Project } from '@/types/project'

import anime from './anime'
import atlashr from './atlashr'
import baderOs from './bader-os'
import bankModernApp from './bank-modern-app'

import gpt3 from './gpt-3'
import homely from './homely'
import innovex from './innovex'
import modernForm from './modern-form'
import nike from './nike'
import oneeSys from './onee-sys'
import zentry from './zentry'

// Stable catalog order: featured internship work first, then by project name.
export const projects: Project[] = [
  atlashr, oneeSys, anime, baderOs, bankModernApp,
  gpt3, homely, innovex, modernForm, nike, zentry,
]

const ids = new Set(projects.map(project => project.id))
if (ids.size !== projects.length) throw new Error('Project catalog contains duplicate IDs.')
if (projects.some(project => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id))) {
  throw new Error('Project catalog IDs must be URL-safe slugs.')
}

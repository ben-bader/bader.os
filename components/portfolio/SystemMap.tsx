import { ArrowRight } from 'lucide-react'
import type { ProjectArchitecture } from '@/lib/project-architecture'

export default function SystemMap({ project, architecture }: { project: { id: string; title: string }; architecture: ProjectArchitecture }) {
  return (
    <div className="absolute z-content inset-[70px_22px_24px] flex flex-col justify-center max-mobile:inset-[62px_15px_18px]" role="group" aria-label={`${project.title} documented system relationships`}>
      <div className="relative z-content mb-[18px] flex justify-between gap-[18px] text-muted font-portfolio-body text-[.62rem] tracking-[.055em] uppercase max-mobile:text-[.53rem]"><span>System map</span><span>{architecture.nodes.length} components <span className="text-accent">·</span> {architecture.edges.length} relationships</span></div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(105px,1fr))] gap-x-5 gap-y-4 max-mobile:grid-cols-2 max-mobile:gap-x-3 max-mobile:gap-y-3">
        {architecture.nodes.map((node, index) => (
          <div className="grid min-w-0 grid-cols-[22px_minmax(0,1fr)] items-baseline gap-x-2 gap-y-0.5" key={node.id}>
            <span className="row-span-2 text-accent font-portfolio-code text-[.55rem]">{String(index + 1).padStart(2, '0')}</span>
            <strong className="min-w-0 text-[.75rem] font-medium [overflow-wrap:anywhere] max-mobile:text-[.67rem]">{node.label}</strong>
            <span className="min-w-0 text-muted text-[.62rem] [overflow-wrap:anywhere] max-mobile:text-[.57rem]">{node.role}</span>
          </div>
        ))}
      </div>
      <ul className="mt-[18px] mb-0 grid grid-cols-2 gap-x-[18px] gap-y-2 p-0 list-none max-mobile:mt-3 max-mobile:gap-x-[9px]">
        {architecture.edges.map(edge => {
          const source = architecture.nodes.find(node => node.id === edge.from)
          const target = architecture.nodes.find(node => node.id === edge.to)
          if (!source || !target) return null
          return (
            <li className="grid min-h-[30px] min-w-0 grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)_auto] items-center gap-[5px] text-[.61rem] max-mobile:min-h-[29px] max-mobile:grid-cols-[minmax(0,1fr)_13px_minmax(0,1fr)] max-mobile:gap-[3px] max-mobile:text-[.54rem]" key={`${edge.from}-${edge.to}`}>
              <span className="[overflow-wrap:anywhere]">{source.label}</span><ArrowRight className="text-accent" aria-hidden="true" size={14} />
              <span className="[overflow-wrap:anywhere]">{target.label}</span><small className="text-muted font-portfolio-code text-[.52rem] max-mobile:hidden">{edge.label ?? edge.type}</small>
            </li>
          )
        })}
      </ul>
      <p className="mt-[10px] mb-0 text-muted text-[.59rem] max-mobile:text-[.54rem]">Components reflect the repository or project documentation.</p>
    </div>
  )
}

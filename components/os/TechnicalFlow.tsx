import type { ProjectSystem } from '@/lib/content'

type TechnicalFlowProps = {
  project: ProjectSystem
  compact?: boolean
}

export default function TechnicalFlow({ project, compact = false }: TechnicalFlowProps) {
  const labels = new Map(project.nodes.map(node => [node.id, node.label]))

  return (
    <div className={`technical-flow${compact ? ' technical-flow-compact' : ''}`}>
      <p className="technical-label">RECORDED SYSTEM RELATIONSHIPS</p>
      <ol>
        {project.edges.map((edge, index) => (
          <li key={`${edge.from}-${edge.to}-${index}`}>
            <span className="flow-source">{labels.get(edge.from) ?? edge.from}</span>
            <span className="flow-connector" aria-hidden="true">→</span>
            <span className="flow-target">{labels.get(edge.to) ?? edge.to}</span>
            <span className="flow-note">{edge.label ?? edge.type}</span>
          </li>
        ))}
      </ol>
      <ul className="component-register" aria-label="Architecture components and current status">
        {project.nodes.map(node => (
          <li key={node.id}>
            <span>{node.label}</span>
            <span>{node.role}</span>
            <span className={`node-state node-state-${node.status}`}>{node.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

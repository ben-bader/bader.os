import { processSteps } from '@/lib/content'
import SectionHeading from './SectionHeading'

export default function LayerProcess() {
  return (
    <section className="process-section page-wrap" id="layer-process" aria-labelledby="process-heading">
      <SectionHeading
        index="05"
        label="PROCESS / ENGINEERING SEQUENCE"
        title="From question to operation."
        description="A six-part framework for moving from requirements to a system that can be observed and maintained."
        headingId="process-heading"
      />
      <ol className="process-steps">
        {processSteps.map(step => (
          <li className="process-step" key={step.id}>
            <span className="process-step-index">{step.phase}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className="process-artifacts"><span>OUTPUTS</span>{step.artifacts.join(' · ')}</div>
          </li>
        ))}
      </ol>
    </section>
  )
}

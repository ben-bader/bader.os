import { intelligenceMetrics } from '@/lib/content'
import SectionHeading from './SectionHeading'

export default function LayerIntelligence() {
  return (
    <section className="intelligence-section" id="layer-intelligence" aria-labelledby="intelligence-heading">
      <div className="page-wrap">
        <SectionHeading
          index="06"
          label="INTELLIGENCE / INVENTORY"
          title="A checkable record."
          description="Counts describe the portfolio data, not product outcomes or performance claims."
          headingId="intelligence-heading"
        />
        <dl className="metric-register">
          {intelligenceMetrics.map(metric => (
            <div className="metric-entry" key={metric.id}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}{metric.suffix}</dd>
              <dd className="metric-detail">{metric.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="metric-footnote">AtlasHR and Homely architecture components are marked pending in their project records.</p>
      </div>
    </section>
  )
}

import SectionIntro from '../SectionIntro'
import KnowledgeGraph from '@/components/visualizations/KnowledgeGraph'

export default function CapabilitiesSection() {
  return (
    <section className="mx-auto w-full max-w-page px-page-gutter py-section max-mobile:py-16" id="capabilities" aria-labelledby="capabilities-title">
      <SectionIntro
        index="03"
        label="What I work with"
        title="Tools with a job to do."
        description="Explore the technologies behind my projects and how they connect."
        headingId="capabilities-title"
      />
      <KnowledgeGraph />
    </section>
  )
}

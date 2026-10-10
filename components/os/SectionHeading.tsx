type SectionHeadingProps = {
  index: string
  label: string
  title: string
  description?: string
  dark?: boolean
  headingId?: string
}

export default function SectionHeading({ index, label, title, description, dark = false, headingId }: SectionHeadingProps) {
  return (
    <header className={`section-heading${dark ? ' section-heading-dark' : ''}`}>
      <p className="section-kicker"><span>{index}</span><span>{label}</span></p>
      <h2 id={headingId}>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}

import { TIMELINE } from '@/lib/content'
import SectionIntro from '../SectionIntro'

const chronology = [...TIMELINE]
  .filter(event => event.id !== 'diploma')
  .sort((a, b) => b.sortDate.localeCompare(a.sortDate))

export default function JourneySection() {
  return (
    <section className="bg-background-soft py-section max-mobile:py-16" id="journey" aria-labelledby="journey-title">
        <div className="mx-auto w-full max-w-page px-page-gutter">
      <div className="[&>div]:mb-editorial-space"><SectionIntro index="04" label="Journey" title="Learning by building." description="Education and internship experience, in the order it happened." headingId="journey-title" /></div>
      <ol className="journey-list m-0 max-w-[1050px] list-none p-0">
        {chronology.map(event => (
          <li className="relative grid grid-cols-[150px_20px_minmax(0,1fr)] gap-5 pb-9 last:pb-0 max-mobile:grid-cols-[16px_minmax(0,1fr)] max-mobile:gap-x-[13px] max-mobile:pb-7" key={event.id}>
            <time className="pt-px text-muted font-portfolio-body text-[.66rem] max-mobile:col-start-2 max-mobile:row-start-1 max-mobile:pt-0" dateTime={event.sortDate}>{event.displayDate}</time>
            <span className="journey-marker relative z-content size-[9px] justify-self-center mt-[5px] border border-accent rounded-full bg-background-soft max-mobile:col-start-1 max-mobile:row-start-1 max-mobile:row-span-2" aria-hidden="true" />
            <div className="max-mobile:col-start-2 [&>h3]:mt-[7px] [&>h3]:mb-0 [&>h3]:font-portfolio-display [&>h3]:text-[1.22rem] [&>h3]:font-medium [&>h3]:tracking-[-.035em] max-mobile:[&>h3]:text-[1.12rem]"><p className="journey-category m-0 flex items-center gap-[10px] text-muted font-portfolio-body text-[.61rem] tracking-[.05em] uppercase">{event.categoryLabel}{event.status === 'current' && <span className="text-accent">Current</span>}</p><h3>{event.title}</h3>{event.organization && <p className="mt-[3px] mb-0 text-copy-secondary text-[.76rem]">{event.organization}{event.location ? ` · ${event.location}` : ''}</p>}<p className="mt-[9px] mb-0 max-w-[660px] text-muted text-[.78rem] leading-[1.7]">{event.description}</p></div>
          </li>
        ))}
      </ol>
        </div>
      </section>
  )
}

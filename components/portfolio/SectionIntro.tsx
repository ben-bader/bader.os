export default function SectionIntro({
  index,
  label,
  title,
  description,
  headingId,
}: {
  index: string
  label: string
  title: string
  description?: string
  headingId: string
}) {
  return (
    <div className="max-w-[790px] mb-[clamp(42px,6vw,76px)] max-mobile:mb-[38px]">
      <p className="m-0 flex items-center gap-3 text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase [&>span:first-child]:text-accent"><span>{index}</span>{label}</p>
      <h2 className="mt-[18px] mb-0 max-w-[780px] font-portfolio-display text-[clamp(2.8rem,12vw,4.5rem)] mobile:mt-[22px] mobile:text-[clamp(2.8rem,6vw,6.3rem)] font-medium leading-[.96] tracking-[-.08em]" id={headingId}>{title}</h2>
      {description && <p className="mt-[17px] mb-0 max-w-[565px] text-muted text-[.88rem] leading-[1.7] mobile:mt-[23px] mobile:text-[.95rem]">{description}</p>}
    </div>
  )
}

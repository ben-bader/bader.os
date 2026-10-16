import { ArrowUpRight } from "lucide-react";
import { identity } from "@/lib/content";

export default function ContactSection() {
  return (
    <section
      className="mx-auto w-full max-w-page px-page-gutter pt-section pb-[clamp(64px,8vw,100px)] max-mobile:pt-16 max-mobile:pb-14"
      id="contact"
      aria-labelledby="contact-title"
    >
      <p className="m-0 flex items-center gap-3 text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase [&>span:first-child]:text-accent">
        <span>05</span>Contact
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-editorial-gap pt-7 pb-9 max-mobile:grid-cols-1 max-mobile:items-start max-mobile:gap-5 max-mobile:py-6">
        <h2
          className="m-0 font-portfolio-display text-[clamp(3.5rem,15vw,5.8rem)] mobile:text-[clamp(3.4rem,8.2vw,8.4rem)] font-medium leading-[.87] tracking-[-.09em]"
          id="contact-title"
        >
          Have a good
          <br />
          <em className="text-accent font-normal">problem</em> to solve?
        </h2>
        <a
          className="inline-flex min-h-12 shrink-0 items-center gap-[14px] text-accent! no-underline text-[clamp(.8rem,1.2vw,1rem)] hover:text-accent-hover"
          href={`mailto:${identity.email}`}
        >
          {identity.email}
          <ArrowUpRight aria-hidden="true" size={17} />
        </a>
      </div>
      <div className="flex items-center justify-between gap-6 pt-editorial-space max-mobile:items-start max-mobile:flex-col max-mobile:gap-[10px]">
        <p className="m-0 text-muted text-[.76rem]">
          Currently open to opportunities.
        </p>
        <div className="flex flex-wrap gap-6 max-mobile:gap-4">
          {[
            [identity.github, "GitHub"],
            [identity.linkedin, "LinkedIn"],
            [identity.resume, "Résumé"],
          ].map(([url, label]) => (
            <a
              className="inline-flex min-h-10 items-center gap-[6px] text-copy-secondary no-underline text-[.73rem] transition-colors duration-fast hover:text-accent"
              href={url}
              target="_blank"
              rel="noreferrer"
              key={label}
            >
              {label} <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import type { Project } from "@/types/project";
import ProjectPreview from "./ProjectPreview";

function DetailSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="grid grid-cols-1 gap-y-3 border-b border-border-subtle py-editorial-space project-wide:grid-cols-[minmax(130px,.32fr)_minmax(0,1fr)] project-wide:gap-x-6">
      <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase">
        {title}
      </h2>
      <ul className="m-0 grid gap-3 p-0 list-none">
        {items.map((item) => (
          <li
            className="relative pl-[19px] text-copy-secondary text-[.88rem] leading-[1.7] before:absolute before:left-0 before:top-[.75em] before:h-px before:w-[7px] before:bg-accent before:content-['']"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProjectDetail({
  project,
  allProjects,
}: {
  project: Project;
  allProjects: Project[];
}) {
  const index = allProjects.findIndex((item) => item.id === project.id);
  const previous = index > 0 ? allProjects[index - 1] : undefined;
  const next =
    index < allProjects.length - 1 ? allProjects[index + 1] : undefined;
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-page px-page-gutter pt-5 pb-[clamp(70px,10vw,130px)]"
    >
      <nav
        className="flex flex-wrap items-center gap-[7px] text-muted text-[.72rem]"
        aria-label="Breadcrumb"
      >
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-copy-secondary no-underline text-[.76rem] hover:text-accent"
          href="/"
        >
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-copy-secondary no-underline text-[.76rem] hover:text-accent"
          href="/projects"
        >
          Projects
        </Link>
        <span aria-hidden="true">/</span>
        <span
          className="max-w-[42vw] overflow-hidden text-copy-secondary text-ellipsis whitespace-nowrap"
          aria-current="page"
        >
          {project.title}
        </span>
      </nav>
      <header className="border-b border-border-strong pt-[clamp(30px,5vw,64px)] pb-[clamp(38px,5.5vw,70px)]">
        <div className="project-detail-hero grid grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] items-center gap-[clamp(24px,3.5vw,50px)] project-wide:max-tablet:grid-cols-[minmax(0,1.05fr)_minmax(250px,.95fr)] project-wide:max-tablet:gap-[clamp(20px,3vw,30px)] max-project-mobile:grid-cols-1 max-project-mobile:gap-[22px]">
          <div className="project-detail-copy min-w-0">
            <p className="m-0 flex items-center gap-3 text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase [&>span:first-child]:text-accent">
              <span>{project.category}</span>
              {project.status && (
                <>
                  <i aria-hidden="true">·</i>
                  {project.status.replace("-", " ")}
                </>
              )}
            </p>
            <h1 className="mt-4 max-w-[1050px] font-portfolio-display text-[clamp(3.4rem,15vw,5.6rem)] project-wide:text-[clamp(3.8rem,9vw,8rem)] font-medium leading-[.9] tracking-[-.09em]">
              {project.title}
            </h1>
            <p className="project-detail-lede mt-[18px] max-w-[720px] text-copy-secondary text-[clamp(1rem,1.8vw,1.3rem)] leading-[1.65]">
              {project.summary}
            </p>
            <div className="project-detail-actions mt-5 flex flex-wrap items-center gap-x-[22px] gap-y-3">
              {project.repositoryUrl && (
                <a
                  className="button button-primary min-h-12 gap-[22px] px-4 text-[.8rem]"
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View repository <ExternalLink aria-hidden="true" size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  className="inline-flex min-h-10 items-center gap-2 text-copy-secondary no-underline text-[.76rem] transition-colors duration-fast hover:text-accent"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open live project{" "}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              )}
            </div>
          </div>
          <ProjectPreview title={project.title} image={project.images[0]} />
        </div>
      </header>

      <div className="project-detail-grid grid grid-cols-[minmax(0,1fr)_minmax(220px,.32fr)] gap-[clamp(36px,9vw,140px)] pt-3 max-project-mobile:grid-cols-1 max-project-mobile:gap-0">
        <div className="project-detail-main min-w-0">
          <section className="grid grid-cols-1 gap-y-3 border-b border-border-subtle py-editorial-space project-wide:grid-cols-[minmax(130px,.32fr)_minmax(0,1fr)] project-wide:gap-x-6">
            <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase">
              Overview
            </h2>
            <p className="mt-4 mb-0 max-w-[760px] text-copy-secondary text-[.93rem] leading-[1.8]">
              {project.description}
            </p>
          </section>
          <DetailSection title="Features" items={project.features} />
          {project.implementation?.length ? (
            <section className="grid grid-cols-1 gap-y-3 border-b border-border-subtle py-editorial-space project-wide:grid-cols-[minmax(130px,.32fr)_minmax(0,1fr)] project-wide:gap-x-6">
              <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase">
                Technology implementation
              </h2>
              <ul className="implementation-list m-0 grid gap-5 p-0 list-none">
                {project.implementation.map((item) => (
                  <li
                    className="relative grid grid-cols-1 project-wide:grid-cols-[minmax(110px,.32fr)_minmax(0,1fr)] gap-x-6 gap-y-1 pl-[19px] text-copy-secondary text-[.88rem] leading-[1.7] before:absolute before:left-0 before:top-[.75em] before:h-px before:w-[7px] before:bg-accent before:content-['']"
                    key={item.technology}
                  >
                    <strong className="text-foreground font-medium">
                      {item.technology}
                    </strong>
                    <span>{item.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <DetailSection
            title="Architecture"
            items={project.architecture ?? []}
          />
          <DetailSection title="Challenges" items={project.challenges ?? []} />
          <DetailSection
            title="What I learned"
            items={project.learnings ?? []}
          />
          {project.role && (
            <section className="grid grid-cols-1 gap-y-3 border-b border-border-subtle py-editorial-space project-wide:grid-cols-[minmax(130px,.32fr)_minmax(0,1fr)] project-wide:gap-x-6">
              <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase">
                My role
              </h2>
              <p className="mt-4 mb-0 max-w-[760px] text-copy-secondary text-[.93rem] leading-[1.8]">
                {project.role}
              </p>
            </section>
          )}
          {project.team && (
            <section className="grid grid-cols-1 gap-y-3 py-editorial-space project-wide:grid-cols-[minmax(130px,.32fr)_minmax(0,1fr)] project-wide:gap-x-6">
              <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase">
                Team
              </h2>
              <p className="mt-4 mb-0 max-w-[760px] text-copy-secondary text-[.93rem] leading-[1.8]">
                {project.team}
              </p>
            </section>
          )}
          {project.images.length > 1 && (
            <section className="grid grid-cols-1 gap-y-3 py-editorial-space project-wide:grid-cols-[minmax(130px,.32fr)_minmax(0,1fr)] project-wide:gap-x-6">
              <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase">
                Project images
              </h2>
              <div className="mt-[18px] grid gap-[18px]">
                {project.images.slice(1).map((image) => (
                  <figure
                    className="m-0 overflow-hidden border border-border-subtle bg-surface"
                    key={image.src}
                  >
                    <Image
                      className="block h-auto w-full"
                      src={image.src}
                      alt={image.alt}
                      width={1200}
                      height={800}
                      sizes="(max-width: 700px) 100vw, 70vw"
                    />
                    <figcaption className="px-[13px] py-2.5 text-muted text-[.68rem]">
                      {image.alt}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="sticky top-[105px] self-start border-l border-border-subtle py-editorial-space pl-5 max-project-mobile:static max-project-mobile:mt-2 max-project-mobile:border-l-0 max-project-mobile:border-t max-project-mobile:pt-7 max-project-mobile:pl-0">
          <div>
            <h2 className="m-0 text-muted font-portfolio-display text-[.7rem] font-semibold tracking-[.06em] uppercase mb-3">
              Technologies
            </h2>
            <ul className="catalog-tech flex flex-wrap gap-x-2 gap-y-2 items-center p-0 list-none">
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="max-w-32 text-copy-secondary text-[.75rem]"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </div>
          <Link
            className="catalog-detail-link mt-[26px] inline-flex min-h-11 items-center gap-2 text-accent no-underline text-[.78rem] hover:text-accent-hover"
            href="/projects"
          >
            Browse all projects <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </aside>
      </div>

      {allProjects.length > 1 && (
        <nav
          className="mt-8 grid grid-cols-2 gap-[18px] border-t border-border-strong project-wide:mt-[54px]"
          aria-label="Other projects"
        >
          {previous ? (
            <Link
              className="flex min-w-0 min-h-[100px] flex-col justify-center gap-2 text-copy-secondary no-underline"
              href={`/projects/${previous.id}`}
            >
              <span className="inline-flex items-center gap-[7px] text-muted font-portfolio-body text-[.61rem] uppercase">
                <ArrowLeft aria-hidden="true" size={14} /> Previous
              </span>
              <strong className="max-w-full overflow-hidden font-portfolio-display text-[clamp(1rem,2vw,1.5rem)] font-medium text-ellipsis whitespace-nowrap">
                {previous.title}
              </strong>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              className="flex min-w-0 min-h-[100px] flex-col items-end justify-center gap-2 text-copy-secondary no-underline text-right"
              href={`/projects/${next.id}`}
            >
              <span className="inline-flex items-center gap-[7px] text-muted font-portfolio-body text-[.61rem] uppercase">
                Next <ArrowRight aria-hidden="true" size={14} />
              </span>
              <strong className="max-w-full overflow-hidden font-portfolio-display text-[clamp(1rem,2vw,1.5rem)] font-medium text-ellipsis whitespace-nowrap">
                {next.title}
              </strong>
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}

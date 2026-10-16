import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { internships } from "@/lib/content";
import { projectArchitectures } from "@/lib/project-architecture";
import { getFeaturedProjects, getProjectById } from "@/lib/projects";
import SectionIntro from "../SectionIntro";
import SystemMap from "../SystemMap";

const featuredProjects = getFeaturedProjects().flatMap((project) => {
  const architecture =
    projectArchitectures[project.id as keyof typeof projectArchitectures];
  return architecture ? [{ project, architecture }] : [];
});
const supportingProjects = Object.entries(projectArchitectures).flatMap(
  ([id, architecture]) => {
    const project = getProjectById(id);
    return project && !project.featured ? [{ project, architecture }] : [];
  },
);

export default function FeaturedWorkSection() {
  return (
    <section
      className="mx-auto w-full max-w-page px-page-gutter pt-section pb-section max-mobile:pt-16 max-mobile:pb-16"
      id="work"
      aria-labelledby="work-title"
    >
      <SectionIntro
        index="01"
        label="Selected work"
        title="Real work. Clear connections."
        description="A closer look at the systems I’ve helped build, the choices behind them, and my part in the work."
        headingId="work-title"
      />
      <div className="grid gap-[clamp(56px,7vw,96px)] max-mobile:gap-14">
        {featuredProjects.map(({ project, architecture }, index) => {
          const internship = internships.find(
            (item) => item.id === (project.id === "atlashr" ? "2sis" : "onee"),
          );
          return (
            <article
              className={`project-record grid grid-cols-1 items-center gap-[clamp(32px,6.5vw,96px)] wide:grid-cols-[minmax(0,1.1fr)_minmax(300px,.75fr)] max-tablet:gap-[27px] ${index === 1 ? "wide:[&>.work-visual]:order-2 wide:[&>.work-copy]:order-1" : ""}`}
              key={project.id}
            >
              <div
                className={`work-visual relative min-h-[clamp(330px,39vw,530px)] overflow-hidden p-[22px] max-tablet:min-h-[clamp(450px,60vw,540px)] wide:max-cinema:min-h-[clamp(460px,42vw,520px)] max-mobile:min-h-[375px] max-mobile:p-[15px]${architecture.nodes.length > 4 ? " work-visual-dense" : ""}${index === 1 ? " work-visual-alt" : ""}`}
              >
                <div className="relative z-content flex justify-between gap-[18px] text-muted font-portfolio-body text-[.62rem] tracking-[.055em] uppercase">
                  <span>PROJECT / {String(index + 1).padStart(2, "0")}</span>
                  <span>{project.period}</span>
                </div>
                <SystemMap project={project} architecture={architecture} />
                <span
                  className="pointer-events-none absolute right-3 bottom-[-79px] text-[rgba(242,245,242,.025)] text-[clamp(13rem,26vw,25rem)] font-semibold leading-none tracking-[-.12em]"
                  aria-hidden="true"
                >
                  {project.title.slice(0, 2)}
                </span>
              </div>
              <div className="work-copy max-tablet:max-w-[720px] py-3">
                <div className="flex items-center justify-between gap-4 text-muted font-portfolio-body text-[.62rem] tracking-[.055em] uppercase">
                  <span>{project.category}</span>
                  {project.status && (
                    <span className="inline-flex items-center gap-[7px] whitespace-nowrap text-copy-secondary max-mobile:whitespace-normal">
                      <i
                        className="size-[6px] rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      {project.status.replace("-", " ")}
                    </span>
                  )}
                </div>
                <h3
                  className="mt-[18px] mb-0 font-portfolio-display text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[.98] tracking-[-.075em] max-mobile:text-[clamp(2.8rem,14vw,4.2rem)]"
                  id={`project-${project.id}`}
                >
                  {project.title}
                </h3>
                <p className="mt-[22px] mb-0 text-copy-secondary text-[.9rem] leading-[1.75]">
                  {project.summary}
                </p>

                {internship && (
                  <p className="mt-[17px] mb-0 text-accent text-[.78rem]">
                    {internship.role} · {internship.company}
                    {internship.location ? `, ${internship.location}` : ""}
                  </p>
                )}
                {project.role && (
                  <details className="contribution-details group/contrib mt-6">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-foreground text-[.75rem]">
                      What I worked on{" "}
                      <span
                        className="text-accent text-[1.1rem] transition-transform duration-fast group-open/contrib:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <ul className="m-0 grid list-none gap-[9px] p-0 pb-[18px] text-muted text-[.75rem]">
                      <li className="relative pl-[14px] before:absolute before:left-0 before:top-[.72em] before:h-px before:w-[5px] before:bg-accent before:content-['']">
                        {project.role}
                      </li>
                    </ul>
                  </details>
                )}
                <ul
                  className="tech-list mt-[18px] mb-0 flex list-none flex-wrap gap-[7px] p-0"
                  aria-label={`${project.title} technologies`}
                >
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <Link
                  className="button button-primary mt-2 mr-2 min-h-10 px-3 text-[.74rem]"
                  href={`/projects/${project.id}`}
                >
                  View details <ArrowRight aria-hidden="true" size={14} />
                </Link>
                {project.repositoryUrl && (
                  <a
                    className="mt-3 inline-flex min-h-10 w-fit items-center gap-[7px] text-accent no-underline text-[.74rem] hover:text-accent-hover"
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View repository{" "}
                    <ArrowUpRight aria-hidden="true" size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-editorial-space">
        <div className="mb-editorial-gap flex items-baseline justify-between gap-6 max-mobile:items-start max-mobile:flex-col max-mobile:gap-2">
          <p className="m-0 flex items-center gap-3 text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase [&>span:first-child]:text-accent">
            <span>Also</span> Academic &amp; explorations
          </p>
          <p className="m-0 text-muted text-[.76rem]">
            More projects from the same practice.
          </p>
        </div>
        <div className="flex justify-between mr-24">
          {supportingProjects.map(({ project }, index) => (
            <article className="flex gap-3" key={project.id}>
              {index == 1 && 
                  <div className="h-full w-[0.5px] bg-white/30 mr-14"/>
              }
              <div className="min-w-0">
                <p className="m-0 text-muted font-portfolio-body text-metadata tracking-[.04em] uppercase">
              <span className="pt-[3px] text-accent font-portfolio-code text-[.7rem]">
                {String(index + 1).padStart(2, "0")}
              </span>{" "}
                  {project.category}
                  {project.period && (
                    <>
                      {" "}
                      <span className="text-accent">·</span> {project.period}
                    </>
                  )}
                  {project.status && (
                    <>
                      {" "}
                      <span className="text-accent">·</span>{" "}
                      {project.status.replace("-", " ")}
                    </>
                  )}
                </p>
                <div>
                <h3 className="mt-2 mb-0 font-portfolio-display text-[clamp(1.6rem,2.5vw,2.4rem)] font-medium tracking-[-.06em] transition-colors duration-fast group-hover:text-accent">
                  <Link
                    className="group text-inherit no-underline hover:text-accent"
                    href={`/projects/${project.id}`}
                  >
                    {project.title}
                  </Link>
                </h3>
              </div>
              <div className="col-start-2 min-w-0 wide:col-start-auto">
                <p className="m-0 max-w-[680px] text-copy-secondary text-[.82rem] leading-[1.7]">
                  {project.summary}
                </p>
                <ul className="tech-list mt-3 mb-0 flex list-none flex-wrap gap-[7px] p-0">
                  {project.technologies.slice(0, 5).map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-x-5">
                  <Link
                    className="group inline-flex min-h-10 items-center gap-[7px] text-accent no-underline text-[.74rem] hover:text-accent-hover"
                    href={`/projects/${project.id}`}
                  >
                    View details{" "}
                    <ArrowRight
                      className="transition-transform duration-fast group-hover:translate-x-1"
                      aria-hidden="true"
                      size={14}
                    />
                  </Link>
                  {project.repositoryUrl && (
                    <a
                      className="button button-secondary min-h-9 px-2 text-[.72rem]"
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repository <ArrowUpRight aria-hidden="true" size={14} />
                    </a>
                  )}
                </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-editorial-space flex flex-wrap items-center justify-between gap-[18px]">
          <p className="m-0 text-muted text-[.76rem]">
            The full archive also includes smaller web projects and experiments.
          </p>
          <Link
            className="button button-primary group min-h-12 gap-[22px] px-4 text-[.8rem]"
            href="/projects"
          >
            More projects{" "}
            <ArrowRight
              className="transition-transform duration-fast group-hover:translate-x-1"
              aria-hidden="true"
              size={16}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

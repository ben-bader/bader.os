import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="catalog-card group flex min-w-0">
      <div className="min-w-0 w-full">
        <div className="flex flex-wrap justify-between w-full items-center gap-x-3 gap-y-1 text-muted font-portfolio-body text-metadata tracking-[.04em] uppercase">
          <div className="flex gap-2 items-center">
            <span className="text-accent font-portfolio-code text-[.68rem]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{project.category}</span>
          </div>
          {project.status && (
            <span className="text-accent">
              {project.status.replace("-", " ")}
            </span>
          )}
        </div>
        <h2 className="mt-2 font-portfolio-display text-[clamp(1.55rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-[-.06em]">
          <Link
            className="text-inherit no-underline transition-colors duration-fast group-hover:text-accent hover:text-accent"
            href={`/projects/${project.id}`}
          >
            {project.title}
          </Link>
        </h2>
        <p className="catalog-summary mt-3 max-w-[540px] text-copy-secondary text-[.84rem] leading-[1.7]">
          {project.summary}
        </p>
        <ul
          className="catalog-tech mt-4 flex flex-wrap gap-x-3 gap-y-1 p-0 list-none"
          aria-label={`${project.title} technologies`}
        >
          {project.technologies.slice(0, 6).map((technology) => (
            <li
              className="text-muted font-portfolio-body text-[.61rem]"
              key={technology}
            >
              {technology}
            </li>
          ))}
          {project.technologies.length > 6 && (
            <li className="text-muted font-portfolio-body text-[.61rem]">
              +{project.technologies.length - 6} more
            </li>
          )}
        </ul>
        <div className="catalog-card-actions mt-4 flex flex-wrap items-center gap-x-5">
          <Link
            className="button button-primary group/link min-h-10 gap-2 px-3 text-[.74rem]"
            href={`/projects/${project.id}`}
          >
            View details
            <ArrowRight
              className="transition-transform duration-fast group-hover/link:translate-x-1"
              aria-hidden="true"
              size={14}
            />
          </Link>
          {project.repositoryUrl && (
            <Link
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-muted text-[.74rem] no-underline transition-colors duration-fast hover:text-foreground"
              aria-label={`${project.title} repository (opens in a new tab)`}
            >
              Source code <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

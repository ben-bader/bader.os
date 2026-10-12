import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="catalog-card">
      
      <div className="catalog-card-meta">
      <p className="catalog-card-index">
        PROJECT / {String(index + 1).padStart(2, "0")}
      </p>
        {project.status && (
          <span className="catalog-status">
            {project.status.replace("-", " ")}
          </span>
        )}
      </div>
      <h2 className="flex justify-between items-center">
        {project.title}
        
      </h2>
      <p className="catalog-summary">{project.summary}</p>
      <ul className="catalog-tech" aria-label={`${project.title} technologies`}>
        {project.technologies.slice(0, 6).map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
        {project.technologies.length > 6 && (
          <li>+{project.technologies.length - 6}</li>
        )}
      </ul>
      <div className="catalog-card-actions justify-start!">
        <Link className="catalog-detail-link bg-lime-300 text-black! p-2" href={`/projects/${project.id}`}>
          View details <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
        {project.repositoryUrl && (
         
          <Link
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm flex items-center justify-center tracking-wider"
            aria-label={`${project.title} repository (opens in a new tab)`}
          >Source Code</Link>
        )}
      </div>
    </article>
  );
}

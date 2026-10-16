import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Bader Bennani's software projects, applications, and frontend experiments.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <main
      id="main-content"
      className="min-h-svh px-page-gutter mx-auto w-full max-w-page pt-[clamp(26px,4vw,44px)] pb-section max-mobile:pb-16"
    >
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-copy-secondary no-underline text-[.76rem] hover:text-accent"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={15} /> Back to portfolio
      </Link>
      <header className="max-w-[900px] pt-[clamp(26px,4vw,48px)] pb-[clamp(28px,4vw,44px)]">
        <p className="m-0 flex items-center gap-3 text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase [&>span:first-child]:text-accent">
          <span>Project archive</span>{" "}
          {String(projects.length).padStart(2, "0")} projects
        </p>
        <h1 className="mt-3 font-portfolio-display text-[clamp(3rem,9vw,6.4rem)] font-medium leading-[.9] tracking-[-.09em]">
          Work, experiments
          <br />
          &amp; <em className="text-accent font-normal">systems.</em>
        </h1>
        <p className="mt-4 max-w-[590px] text-muted text-[.93rem] leading-[1.7]">
          Applications and interface experiments across web development,
          engineering, and product design.
        </p>
      </header>
      {projects.length ? (
        <div className="grid grid-cols-1 project-wide:grid-cols-2 gap-px border border-border-subtle bg-border-subtle">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-muted">
          No projects have been added to the catalog yet.
        </p>
      )}
    </main>
  );
}

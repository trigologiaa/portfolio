import type { JSX } from "react/jsx-runtime";
import type { Project } from "../curation/curate";
import { ProjectCard } from "./project-card";

export function ProjectGrid({
  projects,
  label,
}: {
  projects: Project[];
  label: string;
}): JSX.Element {
  return (
    <ul aria-label={label} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

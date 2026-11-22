import type { Project } from "./curation/curate";

export function findProject(
  projects: readonly Project[],
  slug: string,
): Project | null {
  return projects.find((project: Project) => project.slug === slug) ?? null;
}

export function getAdjacentProjects(
  projects: readonly Project[],
  slug: string,
): { previous: Project | null; next: Project | null } {
  const index: number = projects.findIndex(
    (project: Project) => project.slug === slug,
  );
  if (index === -1) {
    return {
      previous: null,
      next: null,
    };
  }
  return {
    previous: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  };
}

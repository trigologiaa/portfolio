import type { Project } from "./curation/curate";

export function getProjectTitle(project: Project): string {
  return project.enrichment?.title ?? project.repository.name;
}

export function getProjectSummary(project: Project): string | null {
  const summary: string | null =
    project.enrichment?.summary ?? project.repository.description;
  return summary && summary.trim() !== "" ? summary : null;
}

export function getDemoUrl(project: Project): string | null {
  return project.enrichment?.demo ?? project.repository.homepage ?? null;
}

export function getCoverImage(
  project: Project,
): { src: string; alt: string } | null {
  return project.enrichment?.screenshots[0] ?? null;
}

export function formatUpdated(isoDate: string, locale: string): string {
  const date: Date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

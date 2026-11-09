import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCuration, getEnrichment } from "@/lib/content";
import type { Project } from "./curation/curate";
import { getRepositories } from "./github/get-repositories";
import { loadProjects, type ProjectsResult } from "./load-projects";

export async function getProjects(locale: string): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("github");
  const result: ProjectsResult = await loadProjects(locale, {
    getRepositories: () => getRepositories(),
    getCuration,
    getEnrichment,
    now: () => new Date(),
    warn: (message: string) => console.warn(`[projects] ${message}`),
  });
  if (!result.ok) {
    throw new Error(
      `Could not load the projects from GitHub (${result.error})`,
    );
  }
  return result.projects;
}

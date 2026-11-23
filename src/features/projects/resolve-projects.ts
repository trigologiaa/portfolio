import type { Project } from "./curation/curate";
import {
  type LoadProjectsDeps,
  loadProjects,
  type ProjectsResult,
} from "./load-projects";
import type { RepositoriesError, Repository } from "./types";

export type ProjectsSource = "live" | "fallback" | "empty";
export interface ProjectsData {
  projects: Project[];
  source: ProjectsSource;
}

export type ResolveProjectsDeps = LoadProjectsDeps & {
  getFallbackRepositories: () => Repository[];
  isBuildPhase: () => boolean;
  log: (message: string) => void;
};

export class ProjectsUnavailableError extends Error {
  public readonly kind: RepositoriesError;

  public constructor(kind: RepositoriesError) {
    super(`Projects unavailable (${kind})`);
    this.name = "ProjectsUnavailableError";
    this.kind = kind;
  }
}

export async function resolveProjects(
  locale: string,
  deps: ResolveProjectsDeps,
): Promise<ProjectsData> {
  const live: ProjectsResult = await loadProjects(locale, deps);
  if (live.ok && live.projects.length > 0) {
    return {
      projects: live.projects,
      source: "live",
    };
  }
  return {
    projects: [],
    source: "empty",
  };
}

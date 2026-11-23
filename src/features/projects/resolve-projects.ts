import type { Project } from "./curation/curate";
import {
  type LoadProjectsDeps,
  loadProjects,
  type ProjectsResult,
} from "./load-projects";
import { formatGithubFailure } from "./logging";
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
  if (!live.ok) {
    deps.log(formatGithubFailure(live.error, deps.now()));
    if (live.error === "not_configured" || !deps.isBuildPhase()) {
      throw new ProjectsUnavailableError(live.error);
    }
  }
  const fallback = await loadProjects(locale, {
    ...deps,
    getRepositories: async () => ({
      ok: true,
      data: deps.getFallbackRepositories(),
    }),
  });
  if (fallback.ok && fallback.projects.length > 0) {
    return {
      projects: fallback.projects,
      source: "fallback",
    };
  }
  return {
    projects: [],
    source: "empty",
  };
}

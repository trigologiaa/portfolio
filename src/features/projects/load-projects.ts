import type { ProjectEnrichment } from "@/lib/content/enrichment";
import type { Curation } from "@/lib/content/schemas";
import {
  curateProjects,
  findUnknownNames,
  type Project,
} from "./curation/curate";
import type { RepositoriesError, RepositoriesResult } from "./types";

export interface LoadProjectsDeps {
  getRepositories: () => Promise<RepositoriesResult>;
  getCuration: () => Curation;
  getEnrichment: (repoName: string, locale: string) => ProjectEnrichment | null;
  now: () => Date;
  warn: (message: string) => void;
}

export type ProjectsResult =
  | { ok: true; projects: Project[] }
  | { ok: false; error: RepositoriesError };

export async function loadProjects(
  locale: string,
  deps: LoadProjectsDeps,
): Promise<ProjectsResult> {
  const repositories: RepositoriesResult = await deps.getRepositories();
  if (!repositories.ok) {
    return { ok: false, error: repositories.error };
  }
  const curation: Curation = deps.getCuration();
  const unknown: string[] = findUnknownNames(curation, repositories.data);
  if (unknown.length > 0) {
    deps.warn(
      `content/curation.json mentions repositories that do not exist: ${unknown.join(", ")}`,
    );
  }
  const enrichments: Record<string, ProjectEnrichment> = {};
  for (const repo of repositories.data) {
    const enrichment: ProjectEnrichment | null = deps.getEnrichment(
      repo.name,
      locale,
    );
    if (enrichment) {
      enrichments[repo.name] = enrichment;
    }
  }

  return {
    ok: true,
    projects: curateProjects(
      repositories.data,
      curation,
      deps.now(),
      enrichments,
    ),
  };
}

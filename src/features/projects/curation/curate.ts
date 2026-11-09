import type { ProjectEnrichment } from "@/lib/content/enrichment";
import type { Curation } from "@/lib/content/schemas";
import {
  rankRepositories,
  type ScoreBreakdown,
  scoreRepository,
} from "../scoring/score";
import type { Repository } from "../types";

export interface Project {
  slug: string;
  repository: Repository;
  score: number;
  breakdown: ScoreBreakdown;
  pinned: boolean;
  featured: boolean;
  enrichment: ProjectEnrichment | null;
}

export function isHiddenByDefault(
  repo: Repository,
  curation: Curation,
): boolean {
  if (repo.isFork || repo.isArchived) {
    return true;
  }
  if (repo.name.toLowerCase() === curation.selfRepo.toLowerCase()) {
    return true;
  }
  const hasDescription: boolean = (repo.description?.trim().length ?? 0) > 0;
  return !hasDescription && !repo.hasReadme;
}

export function curateProjects(
  repos: readonly Repository[],
  curation: Curation,
  now: Date,
  enrichments: Record<string, ProjectEnrichment> = {},
): Project[] {
  const key: (name: string) => string = (name: string) => name.toLowerCase();
  const excluded: Set<string> = new Set(curation.exclude.map(key));
  const byName: Map<string, Repository> = new Map(
    repos.map((repo: Repository) => [key(repo.name), repo]),
  );
  const pinned: Repository[] = [];
  const pinnedKeys: Set<string> = new Set<string>();
  for (const name of curation.pin) {
    const repo: Repository | undefined = byName.get(key(name));
    if (
      !repo ||
      excluded.has(key(repo.name)) ||
      pinnedKeys.has(key(repo.name))
    ) {
      continue;
    }
    pinnedKeys.add(key(repo.name));
    pinned.push(repo);
  }
  const candidates: Repository[] = repos.filter(
    (repo: Repository) =>
      !pinnedKeys.has(key(repo.name)) &&
      !excluded.has(key(repo.name)) &&
      !isHiddenByDefault(repo, curation),
  );
  const ordered = [
    ...pinned.map((repository) => ({
      repository,
      ...scoreRepository(repository, now),
      pinned: true,
    })),
    ...rankRepositories(candidates, now).map((item) => ({
      ...item,
      pinned: false,
    })),
  ];
  return ordered.map((item, index) => ({
    slug: item.repository.name,
    repository: item.repository,
    score: item.score,
    breakdown: item.breakdown,
    pinned: item.pinned,
    featured: index < curation.featuredCount,
    enrichment: enrichments[item.repository.name] ?? null,
  }));
}

export function findUnknownNames(
  curation: Curation,
  repos: readonly Repository[],
): string[] {
  const known: Set<string> = new Set(
    repos.map((repo: Repository) => repo.name.toLowerCase()),
  );
  return [...curation.pin, ...curation.exclude].filter(
    (name: string) => !known.has(name.toLowerCase()),
  );
}

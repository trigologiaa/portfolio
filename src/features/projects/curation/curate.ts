import type { ProjectEnrichment } from "@/lib/content/enrichment";
import type { Curation } from "@/lib/content/schemas";
import {
  rankRepositories,
  type ScoreBreakdown,
  type ScoredRepository,
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
  const candidates: Repository[] = repos.filter(
    (repo: Repository): boolean => !isHiddenByDefault(repo, curation),
  );
  return rankRepositories(candidates, now).map(
    (item: ScoredRepository, index: number): Project => ({
      slug: item.repository.name,
      repository: item.repository,
      score: item.score,
      breakdown: item.breakdown,
      pinned: false,
      featured: index < curation.featuredCount,
      enrichment: enrichments[item.repository.name] ?? null,
    }),
  );
}

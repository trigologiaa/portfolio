import type { Project } from "@/features/projects/curation/curate";
import type { Repository } from "@/features/projects/types";

export const NOW: Date = new Date("2026-10-16T12:00:00Z");

const MS_PER_SECOND: number = 1000;
const STALE_REPO_AGE_DAYS: number = 2000;
const TYPESCRIPT_BYTES: number = 9000;
const SQL_BYTES: number = 1000;
const SHELL_BYTES: number = 100;
const SAMPLE_PROJECT_SCORE: number = 80;
const SAMPLE_LANGUAGES: Record<string, number> = Object.fromEntries([
  ["TypeScript", TYPESCRIPT_BYTES],
  ["SQL", SQL_BYTES],
  ["Shell", SHELL_BYTES],
]);

export function daysAgo(days: number, from: Date = NOW): string {
  return new Date(
    from.getTime() - days * 24 * 60 * 60 * MS_PER_SECOND,
  ).toISOString();
}

export function makeRepo(overrides: Partial<Repository> = {}): Repository {
  return {
    name: "repo",
    description: null,
    url: "https://github.com/ada/repo",
    homepage: null,
    topics: [],
    language: null,
    languages: {},
    stars: 0,
    forks: 0,
    pushedAt: daysAgo(STALE_REPO_AGE_DAYS),
    isFork: false,
    isArchived: false,
    hasReadme: false,
    ...overrides,
  };
}

export function makeProject(
  options: {
    repo?: Partial<Repository>;
    enrichment?: Project["enrichment"];
    featured?: boolean;
    pinned?: boolean;
  } = {},
): Project {
  const repository: Repository = makeRepo({
    name: "shop-api",
    description: "REST API for an online shop",
    homepage: "https://shop.example.dev",
    language: "TypeScript",
    languages: SAMPLE_LANGUAGES,
    topics: ["api"],
    pushedAt: "2026-09-28T10:00:00Z",
    hasReadme: true,
    ...options.repo,
  });
  return {
    slug: repository.name,
    repository,
    score: SAMPLE_PROJECT_SCORE,
    breakdown: {
      demo: 25,
      readme: 20,
      description: 15,
      recency: 20,
      topics: 0,
      popularity: 0,
    },
    pinned: options.pinned ?? false,
    featured: options.featured ?? false,
    enrichment: options.enrichment ?? null,
  };
}

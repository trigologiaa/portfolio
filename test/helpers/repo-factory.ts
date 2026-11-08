import type { Repository } from "@/features/projects/types";

export const NOW: Date = new Date("2026-10-16T12:00:00Z");

const MS_PER_SECOND: number = 1000;
const STALE_REPO_AGE_DAYS: number = 2000;

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

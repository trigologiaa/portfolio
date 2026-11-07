export interface Repository {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  languages: Record<string, number>;
  stars: number;
  forks: number;
  pushedAt: string;
  isFork: boolean;
  isArchived: boolean;
  hasReadme: boolean;
}

export type RepositoriesError =
  | "rate_limited"
  | "unavailable"
  | "not_configured";

export type RepositoriesResult =
  | { ok: true; data: Repository[] }
  | { ok: false; error: RepositoriesError };

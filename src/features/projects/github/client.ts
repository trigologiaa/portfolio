import { mapWithConcurrency } from "@/lib/concurrency";
import type {
  RepositoriesError,
  RepositoriesResult,
  Repository,
} from "../types";
import type { GithubConfig } from "./config";

const API: string = "https://api.github.com";
const DETAIL_CONCURRENCY: number = 2;
const HTTP_FORBIDDEN: number = 403;
const HTTP_TOO_MANY_REQUESTS: number = 429;

interface RawRepo {
  name: string;
  description: string | null;
  // biome-ignore-start lint/style/useNamingConvention: GitHub API field names are snake_case
  html_url: string;
  homepage: string | null;
  topics?: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  created_at: string;
  // biome-ignore-end lint/style/useNamingConvention: GitHub API field names are snake_case
  fork: boolean;
  archived: boolean;
  owner: { login: string };
}

class GithubRequestError extends Error {
  public readonly kind: Exclude<RepositoriesError, "not_configured">;

  public constructor(kind: Exclude<RepositoriesError, "not_configured">) {
    super(kind);
    this.kind = kind;
  }
}

function buildHeaders(token: string | undefined): HeadersInit {
  return {
    // biome-ignore-start lint/style/useNamingConvention: HTTP header names are fixed by the API
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // biome-ignore-end lint/style/useNamingConvention: HTTP header names are fixed by the API
  };
}

function isRateLimited(response: Response): boolean {
  if (response.status === HTTP_TOO_MANY_REQUESTS) {
    return true;
  }
  return (
    response.status === HTTP_FORBIDDEN &&
    response.headers.get("x-ratelimit-remaining") === "0"
  );
}

function toRepository(
  raw: RawRepo,
  languages: Record<string, number>,
  hasReadme: boolean,
): Repository {
  return {
    name: raw.name,
    description: raw.description,
    url: raw.html_url,
    homepage: raw.homepage ? raw.homepage : null,
    topics: raw.topics ?? [],
    language: raw.language,
    languages,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    pushedAt: raw.pushed_at ?? raw.created_at,
    isFork: raw.fork,
    isArchived: raw.archived,
    hasReadme,
  };
}

export async function fetchRepositories(
  config: GithubConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<RepositoriesResult> {
  async function request(path: string): Promise<Response> {
    let response: Response;
    try {
      response = await fetchImpl(`${API}${path}`, {
        headers: buildHeaders(config.token),
        next: { revalidate: config.revalidateSeconds, tags: ["github"] },
      });
    } catch {
      throw new GithubRequestError("unavailable");
    }
    if (isRateLimited(response)) {
      throw new GithubRequestError("rate_limited");
    }
    return response;
  }
  async function requestJson<T>(path: string): Promise<T> {
    const response = await request(path);
    if (!response.ok) {
      throw new GithubRequestError("unavailable");
    }
    try {
      return (await response.json()) as T;
    } catch {
      throw new GithubRequestError("unavailable");
    }
  }
  try {
    const raws = await requestJson<RawRepo[]>(
      `/users/${config.username}/repos?type=owner&sort=pushed&per_page=100`,
    );
    const data = await mapWithConcurrency(
      raws,
      DETAIL_CONCURRENCY,
      async (raw) => {
        if (raw.fork || raw.archived) {
          return toRepository(raw, {}, false);
        }
        const base = `/repos/${raw.owner.login}/${raw.name}`;
        const [languages, readme] = await Promise.all([
          requestJson<Record<string, number>>(`${base}/languages`),
          request(`${base}/readme`),
        ]);
        return toRepository(raw, languages, readme.ok);
      },
    );
    return { ok: true, data };
  } catch (error) {
    if (error instanceof GithubRequestError) {
      return { ok: false, error: error.kind };
    }
    throw error;
  }
}

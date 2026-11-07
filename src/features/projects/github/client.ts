import { mapWithConcurrency } from "@/lib/concurrency";
import type { RepositoriesResult, Repository } from "../types";
import type { GithubConfig } from "./config";

const API: string = "https://api.github.com";
const DETAIL_CONCURRENCY: number = 2;

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
  fork: boolean;
  archived: boolean;
  // biome-ignore-end lint/style/useNamingConvention: GitHub API field names are snake_case
  owner: {
    login: string;
  };
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
  const get = (path: string): Promise<Response> =>
    fetchImpl(`${API}${path}`, {
      headers: buildHeaders(config.token),
      next: { revalidate: config.revalidateSeconds, tags: ["github"] },
    });
  const listResponse = await get(
    `/users/${config.username}/repos?type=owner&sort=pushed&per_page=100`,
  );
  const raws = (await listResponse.json()) as RawRepo[];
  const data = await mapWithConcurrency(
    raws,
    DETAIL_CONCURRENCY,
    async (raw) => {
      if (raw.fork || raw.archived) {
        return toRepository(raw, {}, false);
      }
      const base = `/repos/${raw.owner.login}/${raw.name}`;
      const [languagesResponse, readmeResponse] = await Promise.all([
        get(`${base}/languages`),
        get(`${base}/readme`),
      ]);
      const languages = (await languagesResponse.json()) as Record<
        string,
        number
      >;
      return toRepository(raw, languages, readmeResponse.ok);
    },
  );
  return { ok: true, data };
}

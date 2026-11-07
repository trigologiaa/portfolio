// @vitest-environment node

import { describe, expect, it } from "vitest";
import { fetchRepositories } from "@/features/projects/github/client";
import type { GithubConfig } from "@/features/projects/github/config";
import type { RepositoriesResult } from "@/features/projects/types";
import {
  type FetchMock,
  jsonResponse,
  makeFetch,
  rawRepo,
} from "../../../helpers/github-mock";

const REPO_COUNT: number = 3;
const TYPESCRIPT_BYTES: number = 9000;
const CSS_BYTES: number = 1000;
const MANY_REPOS_COUNT: number = 10;
const DETAIL_CONCURRENCY: number = 2;
const REQUESTS_PER_REPO: number = 2;
const MAX_IN_FLIGHT: number = DETAIL_CONCURRENCY * REQUESTS_PER_REPO;
const SLOW_RESPONSE_MS: number = 5;

// biome-ignore-start lint/style/useNamingConvention: GitHub language names are PascalCase
const ALPHA_LANGUAGES: Record<string, number> = {
  TypeScript: TYPESCRIPT_BYTES,
  CSS: CSS_BYTES,
};
// biome-ignore-end lint/style/useNamingConvention: GitHub language names are PascalCase

const config: GithubConfig = {
  username: "ada",
  token: undefined,
  revalidateSeconds: 3600,
  dataSource: "api",
};

type NextRequestInit = RequestInit & {
  next?: { revalidate: number; tags: string[] };
};

function firstRequestInit(fetchMock: FetchMock): NextRequestInit {
  return (fetchMock.mock.calls[0]?.[1] ?? {}) as NextRequestInit;
}

function firstRequestHeaders(fetchMock: FetchMock): Record<string, string> {
  return (firstRequestInit(fetchMock).headers ?? {}) as Record<string, string>;
}

describe("fetchRepositories", (): void => {
  it("normalizes the repositories returned by the API", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      repos: [
        rawRepo({
          name: "alpha",
          description: "Alpha app",
          homepage: "https://alpha.dev",
          topics: ["react"],
          // biome-ignore-start lint/style/useNamingConvention: GitHub API field names are snake_case
          stargazers_count: 4,
          forks_count: 1,
          // biome-ignore-end lint/style/useNamingConvention: GitHub API field names are snake_case
        }),
        rawRepo({ name: "beta", homepage: "" }),
        rawRepo({ name: "gamma", description: null }),
      ],
      languages: { alpha: ALPHA_LANGUAGES },
      readmes: { gamma: false },
    });
    const result = await fetchRepositories(config, fetchMock);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.data).toHaveLength(REPO_COUNT);
    expect(result.data[0]).toEqual({
      name: "alpha",
      description: "Alpha app",
      url: "https://github.com/ada/alpha",
      homepage: "https://alpha.dev",
      topics: ["react"],
      language: "TypeScript",
      languages: ALPHA_LANGUAGES,
      stars: 4,
      forks: 1,
      pushedAt: "2026-09-01T10:00:00Z",
      isFork: false,
      isArchived: false,
      hasReadme: true,
    });
    const [, beta, gamma] = result.data;
    expect(beta?.homepage).toBeNull();
    expect(gamma?.description).toBeNull();
    expect(gamma?.hasReadme).toBe(false);
  });

  it("reports rate_limited when GitHub says the quota is exhausted (403)", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      list: (): Response =>
        new Response("{}", {
          status: 403,
          headers: { "x-ratelimit-remaining": "0" },
        }),
    });
    expect(await fetchRepositories(config, fetchMock)).toEqual({
      ok: false,
      error: "rate_limited",
    });
  });

  it("reports rate_limited on a 429", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      list: (): Response => new Response("{}", { status: 429 }),
    });
    expect(await fetchRepositories(config, fetchMock)).toEqual({
      ok: false,
      error: "rate_limited",
    });
  });

  it("reports unavailable on a 403 that is not about the quota", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      list: (): Response =>
        new Response("{}", {
          status: 403,
          headers: { "x-ratelimit-remaining": "42" },
        }),
    });
    expect(await fetchRepositories(config, fetchMock)).toEqual({
      ok: false,
      error: "unavailable",
    });
  });

  it("reports unavailable on a server error or an unknown user", async (): Promise<void> => {
    const serverError: FetchMock = makeFetch({
      list: (): Response => new Response("{}", { status: 500 }),
    });
    const notFound: FetchMock = makeFetch({
      list: (): Response => new Response("{}", { status: 404 }),
    });
    expect(await fetchRepositories(config, serverError)).toEqual({
      ok: false,
      error: "unavailable",
    });
    expect(await fetchRepositories(config, notFound)).toEqual({
      ok: false,
      error: "unavailable",
    });
  });

  it("reports unavailable instead of throwing when the network fails", async (): Promise<void> => {
    const failing: typeof fetch = (): Promise<Response> =>
      Promise.reject(new TypeError("fetch failed"));
    expect(await fetchRepositories(config, failing)).toEqual({
      ok: false,
      error: "unavailable",
    });
  });

  it("reports rate_limited if the quota runs out while reading a repository's details", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      repos: [rawRepo({ name: "alpha" })],
    });
    const limited: typeof fetch = (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      if (String(input).endsWith("/languages")) {
        return Promise.resolve(
          new Response("{}", {
            status: 403,
            headers: { "x-ratelimit-remaining": "0" },
          }),
        );
      }
      return fetchMock(input, init);
    };
    expect(await fetchRepositories(config, limited)).toEqual({
      ok: false,
      error: "rate_limited",
    });
  });

  it("reports unavailable when the response is not valid JSON", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      list: (): Response => new Response("<html>oops</html>", { status: 200 }),
    });
    expect(await fetchRepositories(config, fetchMock)).toEqual({
      ok: false,
      error: "unavailable",
    });
  });

  it("sends the token as a bearer header when it is configured", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({ repos: [] });
    await fetchRepositories({ ...config, token: "secret-token" }, fetchMock);
    expect(firstRequestHeaders(fetchMock).Authorization).toBe(
      "Bearer secret-token",
    );
  });

  it("does not send an Authorization header without a token", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({ repos: [] });
    await fetchRepositories(config, fetchMock);
    expect(firstRequestHeaders(fetchMock)).not.toHaveProperty("Authorization");
  });

  it("asks Next.js to cache the response for an hour and tags it for on-demand refresh", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({ repos: [] });
    await fetchRepositories(config, fetchMock);
    expect(firstRequestInit(fetchMock).next).toEqual({
      revalidate: 3600,
      tags: ["github"],
    });
  });

  it("limits how many requests run at the same time", async (): Promise<void> => {
    let inFlight: number = 0;
    let peak: number = 0;
    const repos: Record<string, unknown>[] = Array.from(
      { length: MANY_REPOS_COUNT },
      (_: unknown, i: number): Record<string, unknown> =>
        rawRepo({ name: `repo-${i}` }),
    );
    const slowFetch: typeof fetch = async (
      input: RequestInfo | URL,
    ): Promise<Response> => {
      const { pathname } = new URL(String(input));
      if (pathname.endsWith("/repos")) {
        return jsonResponse(repos);
      }
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, SLOW_RESPONSE_MS));
      inFlight--;
      return jsonResponse({});
    };
    await fetchRepositories(config, slowFetch);
    expect(peak).toBeLessThanOrEqual(MAX_IN_FLIGHT);
  });

  it("makes 1 + 2 requests per visible repository and none for forks or archived ones", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      repos: [
        rawRepo({ name: "mine" }),
        rawRepo({ name: "forked", fork: true }),
        rawRepo({ name: "old", archived: true }),
      ],
    });
    const result: RepositoriesResult = await fetchRepositories(
      config,
      fetchMock,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1 + 2);
    expect(result.ok && result.data.map((repo) => repo.name)).toEqual([
      "mine",
      "forked",
      "old",
    ]);
    expect(result.ok && result.data[1]?.isFork).toBe(true);
  });
});

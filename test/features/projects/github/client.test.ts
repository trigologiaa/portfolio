// @vitest-environment node

import { describe, expect, it } from "vitest";
import { fetchRepositories } from "@/features/projects/github/client";
import type { GithubConfig } from "@/features/projects/github/config";
import {
  type FetchMock,
  makeFetch,
  rawRepo,
} from "../../../helpers/github-mock";

const REPO_COUNT: number = 3;
const TYPESCRIPT_BYTES: number = 9000;
const CSS_BYTES: number = 1000;

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
});

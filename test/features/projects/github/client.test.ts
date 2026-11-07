// @vitest-environment node

import { describe, expect, it } from "vitest";
import { fetchRepositories } from "@/features/projects/github/client";
import type { GithubConfig } from "@/features/projects/github/config";
import { makeFetch, rawRepo } from "../../../helpers/github-mock";

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
    const fetchMock = makeFetch({
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
});

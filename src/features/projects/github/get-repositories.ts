import { z } from "zod";
import type { RepositoriesResult, Repository } from "../types";
import { fetchRepositories } from "./client";
import { type GithubConfigResult, readGithubConfig } from "./config";

const repositorySchema: z.ZodType<Repository> = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  url: z.url(),
  homepage: z.string().nullable(),
  topics: z.array(z.string()),
  language: z.string().nullable(),
  languages: z.record(z.string(), z.number()),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  pushedAt: z.string().min(1),
  isFork: z.boolean(),
  isArchived: z.boolean(),
  hasReadme: z.boolean(),
});

async function loadFixture(): Promise<Repository[]> {
  const fixture: unknown = (await import("./fixtures/repos.json")).default;
  return z.array(repositorySchema).parse(fixture);
}

export async function getRepositories(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<RepositoriesResult> {
  const result: GithubConfigResult = readGithubConfig(env);
  if (!result.ok) {
    return { ok: false, error: "not_configured" };
  }
  if (result.config.dataSource === "fixture") {
    return { ok: true, data: await loadFixture() };
  }
  return fetchRepositories(result.config, fetchImpl);
}

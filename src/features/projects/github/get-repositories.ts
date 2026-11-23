import { repositoriesSchema } from "../schema";
import type { RepositoriesResult, Repository } from "../types";
import { fetchRepositories } from "./client";
import { type GithubConfigResult, readGithubConfig } from "./config";

async function loadFixture(): Promise<Repository[]> {
  const fixture = (await import("./fixtures/repos.json")).default;
  return repositoriesSchema.parse(fixture);
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

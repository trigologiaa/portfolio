import { describe, expect, it, vi } from "vitest";
import { getRepositories } from "@/features/projects/github/get-repositories";
import type { RepositoriesResult, Repository } from "@/features/projects/types";
import {
  type FetchMock,
  makeFetch,
  rawRepo,
} from "../../../helpers/github-mock";

const FIXTURE_REPO_COUNT: number = 13;
const FIXTURE_FORK_COUNT: number = 1;
const FIXTURE_ARCHIVED_COUNT: number = 1;

describe("getRepositories", (): void => {
  it("reports not_configured when the username is missing", async (): Promise<void> => {
    expect(await getRepositories({}, makeFetch())).toEqual({
      ok: false,
      error: "not_configured",
    });
  });

  it("reads the bundled fixture in fixture mode without touching the network", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch();
    const result: RepositoriesResult = await getRepositories(
      {
        // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
        GH_DATA_SOURCE: "fixture",
      },
      fetchMock,
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.data).toHaveLength(FIXTURE_REPO_COUNT);
    expect(
      result.data.filter((repo: Repository): boolean => repo.isFork),
    ).toHaveLength(FIXTURE_FORK_COUNT);
    expect(
      result.data.filter((repo: Repository): boolean => repo.isArchived),
    ).toHaveLength(FIXTURE_ARCHIVED_COUNT);
  });

  it("fetches from the API when configured", async (): Promise<void> => {
    const fetchMock: FetchMock = makeFetch({
      repos: [rawRepo({ name: "alpha" })],
    });
    const result: RepositoriesResult = await getRepositories(
      {
        // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
        GH_USERNAME: "ada",
      },
      fetchMock,
    );
    expect(
      result.ok && result.data.map((repo: Repository): string => repo.name),
    ).toEqual(["alpha"]);
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/users/ada/repos");
  });

  it("rejects a fixture file that does not match the Repository shape", async (): Promise<void> => {
    vi.resetModules();
    vi.doMock("@/features/projects/github/fixtures/repos.json", () => ({
      default: [{ name: "broken" }],
    }));
    const { getRepositories: getWithBrokenFixture } = await import(
      "@/features/projects/github/get-repositories"
    );
    await expect(
      getWithBrokenFixture(
        {
          // biome-ignore lint/style/useNamingConvention: env var names are SCREAMING_SNAKE_CASE
          GH_DATA_SOURCE: "fixture",
        },
        makeFetch(),
      ),
    ).rejects.toThrow();
    vi.doUnmock("@/features/projects/github/fixtures/repos.json");
  });
});

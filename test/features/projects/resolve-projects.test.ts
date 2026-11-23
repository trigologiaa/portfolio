import { describe, expect, it, type Mock, vi } from "vitest";
import {
  type ResolveProjectsDeps,
  resolveProjects,
} from "@/features/projects/resolve-projects";
import type { Repository } from "@/features/projects/types";
import { makeRepo, NOW } from "../../helpers/repo-factory";

const slugs = (data: { projects: { slug: string }[] }): string[] =>
  data.projects.map((p) => p.slug);

function repo(name: string, overrides: Partial<Repository> = {}): Repository {
  return makeRepo({
    name,
    description: "A description that is long enough",
    hasReadme: true,
    ...overrides,
  });
}

function deps(
  overrides: Partial<ResolveProjectsDeps> = {},
): ResolveProjectsDeps {
  return {
    getRepositories: async () => ({
      ok: true,
      data: [repo("live-a"), repo("live-b")],
    }),
    getCuration: () => ({
      exclude: [],
      pin: [],
      featuredCount: 6,
      selfRepo: "portfolio",
    }),
    getEnrichment: () => null,
    now: () => NOW,
    warn: vi.fn(),
    getFallbackRepositories: () => [repo("saved-a")],
    isBuildPhase: () => false,
    log: vi.fn(),
    ...overrides,
  };
}

describe("resolveProjects: GitHub works", (): void => {
  it("returns the live projects", async (): Promise<void> => {
    const data = await resolveProjects("en", deps());
    expect(data.source).toBe("live");
    expect(slugs(data)).toEqual(["live-a", "live-b"]);
  });

  it("does not touch the fallback", async (): Promise<void> => {
    const getFallbackRepositories: Mock<() => never[]> = vi.fn(() => []);
    await resolveProjects("en", deps({ getFallbackRepositories }));
    expect(getFallbackRepositories).not.toHaveBeenCalled();
  });
});

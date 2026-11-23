import { describe, expect, it, type Mock, vi } from "vitest";
import {
  ProjectsUnavailableError,
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

describe("resolveProjects: GitHub fails", (): void => {
  const failing = {
    getRepositories: async () => ({
      ok: false as const,
      error: "rate_limited" as const,
    }),
  };

  it("throws in production so that Next.js keeps serving the previous page", async (): Promise<void> => {
    await expect(
      resolveProjects("en", deps({ ...failing, isBuildPhase: () => false })),
    ).rejects.toThrow(ProjectsUnavailableError);
  });

  it("reports which kind of error it was", async (): Promise<void> => {
    await expect(
      resolveProjects("en", deps({ ...failing })),
    ).rejects.toMatchObject({
      kind: "rate_limited",
    });
  });

  it("uses the saved snapshot while building", async (): Promise<void> => {
    const data = await resolveProjects(
      "en",
      deps({ ...failing, isBuildPhase: () => true }),
    );
    expect(data.source).toBe("fallback");
    expect(slugs(data)).toEqual(["saved-a"]);
  });

  it("applies the curation to the snapshot too", async (): Promise<void> => {
    const data = await resolveProjects(
      "en",
      deps({
        ...failing,
        isBuildPhase: () => true,
        getCuration: () => ({
          exclude: ["saved-a"],
          pin: [],
          featuredCount: 6,
          selfRepo: "portfolio",
        }),
      }),
    );
    expect(data.source).toBe("empty");
  });

  it("shows the empty state when the build fails and there is no snapshot", async (): Promise<void> => {
    const data = await resolveProjects(
      "en",
      deps({
        ...failing,
        isBuildPhase: () => true,
        getFallbackRepositories: () => [],
      }),
    );
    expect(data).toEqual({ projects: [], source: "empty" });
  });

  it("logs the failure without secrets", async (): Promise<void> => {
    const log = vi.fn();
    await resolveProjects(
      "en",
      deps({ ...failing, isBuildPhase: () => true, log }),
    );
    expect(log).toHaveBeenCalledWith(
      "[projects] GitHub request failed (rate_limited) at 2026-10-16T12:00:00.000Z",
    );
  });

  it("never hides a configuration error behind the snapshot", async (): Promise<void> => {
    await expect(
      resolveProjects(
        "en",
        deps({
          getRepositories: async () => ({ ok: false, error: "not_configured" }),
          isBuildPhase: () => true,
        }),
      ),
    ).rejects.toMatchObject({ kind: "not_configured" });
  });
});

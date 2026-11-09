import { describe, expect, it, vi } from "vitest";
import {
  type LoadProjectsDeps,
  loadProjects,
} from "@/features/projects/load-projects";
import type { Repository } from "@/features/projects/types";
import { makeRepo, NOW } from "../../helpers/repo-factory";

function repo(name: string, overrides: Partial<Repository> = {}): Repository {
  return makeRepo({
    name,
    description: "A description that is long enough",
    hasReadme: true,
    ...overrides,
  });
}

function deps(overrides: Partial<LoadProjectsDeps> = {}): LoadProjectsDeps {
  return {
    getRepositories: async () => ({ ok: true, data: [repo("a"), repo("b")] }),
    getCuration: () => ({
      exclude: [],
      pin: [],
      featuredCount: 6,
      selfRepo: "portfolio",
    }),
    getEnrichment: () => null,
    now: () => NOW,
    warn: vi.fn(),
    ...overrides,
  };
}

describe("loadProjects", () => {
  it("returns the curated projects", async (): Promise<void> => {
    const result = await loadProjects("en", deps());
    expect(result.ok && result.projects.map((project) => project.slug)).toEqual(
      ["a", "b"],
    );
  });

  it("applies the curation", async (): Promise<void> => {
    const result = await loadProjects(
      "en",
      deps({
        getCuration: () => ({
          exclude: ["a"],
          pin: [],
          featuredCount: 6,
          selfRepo: "portfolio",
        }),
      }),
    );
    expect(result.ok && result.projects.map((project) => project.slug)).toEqual(
      ["b"],
    );
  });

  it("attaches the enrichment of the requested language", async (): Promise<void> => {
    const getEnrichment = vi.fn((name: string, locale: string) =>
      name === "a"
        ? { tags: [], screenshots: [], body: `text in ${locale}` }
        : null,
    );
    const result = await loadProjects("es", deps({ getEnrichment }));
    expect(getEnrichment).toHaveBeenCalledWith("a", "es");
    expect(result.ok && result.projects[0]?.enrichment?.body).toBe(
      "text in es",
    );
  });

  it("warns about curation names that match no repository", async (): Promise<void> => {
    const warn = vi.fn();
    await loadProjects(
      "en",
      deps({
        warn,
        getCuration: () => ({
          exclude: [],
          pin: ["tpyo"],
          featuredCount: 6,
          selfRepo: "portfolio",
        }),
      }),
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("tpyo"));
  });

  it("passes the GitHub error through", async (): Promise<void> => {
    const result = await loadProjects(
      "en",
      deps({
        getRepositories: async () => ({ ok: false, error: "rate_limited" }),
      }),
    );
    expect(result).toEqual({ ok: false, error: "rate_limited" });
  });
});

import { describe, expect, it } from "vitest";
import type { Project } from "@/features/projects/curation/curate";
import {
  formatUpdated,
  getCoverImage,
  getDemoUrl,
  getProjectSummary,
  getProjectTitle,
} from "@/features/projects/presentation";
import type { ProjectEnrichment } from "@/lib/content/enrichment";
import { makeProject } from "../../helpers/repo-factory";

const enriched: ProjectEnrichment = {
  title: "Shop API (v2)",
  summary: "Hand-written summary",
  demo: "https://custom-demo.dev",
  tags: [],
  screenshots: [{ src: "/projects/shop-api/home.png", alt: "Home" }],
  body: "",
};

describe("project presentation helpers", (): void => {
  it("prefers the enrichment over the GitHub data", (): void => {
    const project: Project = makeProject({ enrichment: enriched });
    expect(getProjectTitle(project)).toBe("Shop API (v2)");
    expect(getProjectSummary(project)).toBe("Hand-written summary");
    expect(getDemoUrl(project)).toBe("https://custom-demo.dev");
    expect(getCoverImage(project)).toEqual({
      src: "/projects/shop-api/home.png",
      alt: "Home",
    });
  });

  it("falls back to the GitHub data", (): void => {
    const project: Project = makeProject();
    expect(getProjectTitle(project)).toBe("shop-api");
    expect(getProjectSummary(project)).toBe("REST API for an online shop");
    expect(getDemoUrl(project)).toBe("https://shop.example.dev");
    expect(getCoverImage(project)).toBeNull();
  });

  it("returns null when there is no summary or demo anywhere", (): void => {
    const project: Project = makeProject({
      repo: { description: null, homepage: null },
    });
    expect(getProjectSummary(project)).toBeNull();
    expect(getDemoUrl(project)).toBeNull();
  });

  it("treats a blank description as missing", (): void => {
    expect(
      getProjectSummary(makeProject({ repo: { description: "   " } })),
    ).toBeNull();
  });
});

describe("formatUpdated", (): void => {
  it("formats the month and the year in the requested language", (): void => {
    expect(formatUpdated("2026-09-28T23:30:00Z", "en")).toBe("Sep 2026");
    expect(formatUpdated("2026-09-28T23:30:00Z", "es")).toMatch(
      /^sept?\.? 2026$/i,
    );
  });

  it("returns an empty text for an invalid date", (): void => {
    expect(formatUpdated("nope", "en")).toBe("");
  });
});

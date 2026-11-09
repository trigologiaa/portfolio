import { describe, expect, it } from "vitest";
import type { Project } from "@/features/projects/curation/curate";
import { getProjectTech } from "@/features/projects/tech";
import { makeProject } from "../../helpers/repo-factory";

const CSS_BYTES: number = 500;
const TYPESCRIPT_BYTES: number = 9000;
const HTML_BYTES: number = 1500;
const SMALL_BYTES: number = 100;

describe("getProjectsTech", (): void => {
  it("lists the languages from the most to the least used", (): void => {
    const project: Project = makeProject({
      repo: {
        languages: Object.fromEntries([
          ["CSS", CSS_BYTES],
          ["TypeScript", TYPESCRIPT_BYTES],
          ["HTML", HTML_BYTES],
        ]),
        topics: [],
      },
    });
    expect(getProjectTech(project)).toEqual(["TypeScript", "HTML", "CSS"]);
  });

  it("adds the topics and the enrichment tags after the languages", (): void => {
    const project: Project = makeProject({
      repo: {
        languages: Object.fromEntries([["TypeScript", SMALL_BYTES]]),
        topics: ["api", "nodejs"],
      },
      enrichment: { tags: ["postgres"], screenshots: [], body: "" },
    });
    expect(getProjectTech(project)).toEqual([
      "TypeScript",
      "postgres",
      "api",
      "nodejs",
    ]);
  });

  it("does not repeat a name that differs only in upper or lower case", (): void => {
    const project: Project = makeProject({
      repo: {
        languages: Object.fromEntries([["TypeScript", SMALL_BYTES]]),
        topics: ["typescript", "react"],
      },
    });
    expect(getProjectTech(project)).toEqual(["TypeScript", "react"]);
  });

  it("falls back to the main language when the breakdown is empty", (): void => {
    const project: Project = makeProject({
      repo: { languages: {}, language: "Python", topics: [] },
    });
    expect(getProjectTech(project)).toEqual(["Python"]);
  });

  it("returns an empty list when there is nothing to show", (): void => {
    const project: Project = makeProject({
      repo: { languages: {}, language: null, topics: [] },
    });
    expect(getProjectTech(project)).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import type { Project } from "@/features/projects/curation/curate";
import type { TechOption } from "@/features/projects/filter";
import { filterProjects, getTechOptions } from "@/features/projects/filter";
import { makeProject } from "../../helpers/repo-factory";

function project(
  name: string,
  languageNames: string[],
  topics: string[] = [],
): Project {
  return makeProject({
    repo: {
      name,
      languages: Object.fromEntries(
        languageNames.map((language) => [language, 1]),
      ),
      topics,
    },
  });
}

describe("getTechOptions", (): void => {
  it("lists every technology once, with the number of projects that use it", (): void => {
    const options: TechOption[] = getTechOptions([
      project("a", ["TypeScript"], ["react"]),
      project("b", ["TypeScript", "CSS"]),
      project("c", ["Python"]),
    ]);
    expect(options).toEqual([
      { name: "TypeScript", count: 2 },
      { name: "CSS", count: 1 },
      { name: "Python", count: 1 },
      { name: "react", count: 1 },
    ]);
  });

  it("orders by number of projects and then by name", (): void => {
    const options: TechOption[] = getTechOptions([
      project("a", ["B", "A"]),
      project("b", ["C"]),
    ]);
    expect(options.map((option: TechOption) => option.name)).toEqual([
      "A",
      "B",
      "C",
    ]);
  });

  it("merges names that differ only in upper or lower case", (): void => {
    const options: TechOption[] = getTechOptions([
      project("a", ["TypeScript"]),
      project("b", [], ["typescript"]),
    ]);
    expect(options).toEqual([{ name: "TypeScript", count: 2 }]);
  });

  it("returns an empty list when there are no projects", (): void => {
    expect(getTechOptions([])).toEqual([]);
  });
});

describe("filterProjects", (): void => {
  const ts = project("ts-app", ["Typescript"]);
  const py = project("py-app", ["Python"]);
  const both = project("both", ["TypeScript", "Python"]);
  const all = [ts, py, both];
  const names = (projects: typeof all): string[] => projects.map((p) => p.slug);

  it("returns every project when nothing is selected", (): void => {
    expect(filterProjects(all, [])).toEqual(all);
  });

  it("keeps the projects that use the selected technology", (): void => {
    expect(names(filterProjects(all, ["TypeScript"]))).toEqual([
      "ts-app",
      "both",
    ]);
  });

  it("combines several technologies with OR", (): void => {
    expect(names(filterProjects(all, ["TypeScript", "Python"]))).toEqual([
      "ts-app",
      "py-app",
      "both",
    ]);
  });

  it("ignores upper and lower case", (): void => {
    expect(names(filterProjects(all, ["python"]))).toEqual(["py-app", "both"]);
  });

  it("returns an empty list when nothing matches", (): void => {
    expect(filterProjects(all, ["Rust"])).toEqual([]);
  });

  it("keeps the original order", (): void => {
    expect(names(filterProjects([both, ts], ["TypeScript"]))).toEqual([
      "both",
      "ts-app",
    ]);
  });
});

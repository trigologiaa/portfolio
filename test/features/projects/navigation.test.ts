import { describe, expect, it } from "vitest";
import type { Project } from "@/features/projects/curation/curate";
import {
  findProject,
  getAdjacentProjects,
} from "@/features/projects/navigation";
import { makeProject } from "../../helpers/repo-factory";

const projects: Project[] = ["a", "b", "c"].map((name: string) =>
  makeProject({ repo: { name } }),
);

describe("findProject", (): void => {
  it("finds a project by its slug", (): void => {
    expect(findProject(projects, "b")?.slug).toBe("b");
  });

  it("returns null for an unknown slug", (): void => {
    expect(findProject(projects, "zzz")).toBeNull();
  });

  it("does not match a different case, so each URL has a single spelling", (): void => {
    expect(findProject(projects, "B")).toBeNull();
  });
});

describe("getAdjacentProject", (): void => {
  it("returns the previous and the next project", (): void => {
    const { previous, next } = getAdjacentProjects(projects, "b");
    expect(previous?.slug).toBe("a");
    expect(next?.slug).toBe("c");
  });

  it("has no previous project for the first one", (): void => {
    const { previous, next } = getAdjacentProjects(projects, "a");
    expect(previous).toBeNull();
    expect(next?.slug).toBe("b");
  });

  it("has no next project for the last one", (): void => {
    const { previous, next } = getAdjacentProjects(projects, "c");
    expect(previous?.slug).toBe("b");
    expect(next).toBeNull();
  });

  it("returns nothing for an unknown slug or a single project", (): void => {
    expect(getAdjacentProjects(projects, "zzz")).toEqual({
      previous: null,
      next: null,
    });
    expect(getAdjacentProjects(projects.slice(0, 1), "a")).toEqual({
      previous: null,
      next: null,
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  curateProjects,
  type Project,
} from "@/features/projects/curation/curate";
import type { Repository } from "@/features/projects/types";
import type { Curation } from "@/lib/content/schemas";
import { makeRepo, NOW } from "../../../helpers/repo-factory";

const base: Curation = {
  exclude: [],
  pin: [],
  featuredCount: 6,
  selfRepo: "portfolio",
};
const names = (projects: { slug: string }[]): string[] =>
  projects.map((project: { slug: string }): string => project.slug);

function visible(
  name: string,
  overrides: Partial<Repository> = {},
): Repository {
  return makeRepo({
    name,
    description: "A description with enough text",
    hasReadme: true,
    ...overrides,
  });
}

describe("curateProjects: hidden by default", (): void => {
  it("hides forks and archived repositories", (): void => {
    const result: Project[] = curateProjects(
      [
        visible("mine"),
        visible("forked", { isFork: true }),
        visible("old", { isArchived: true }),
      ],
      base,
      NOW,
    );
    expect(names(result)).toEqual(["mine"]);
  });

  it("hides the portfolio repository itself", (): void => {
    const result: Project[] = curateProjects(
      [visible("portfolio"), visible("app")],
      base,
      NOW,
    );
    expect(names(result)).toEqual(["app"]);
  });

  it("hides repositories with neither a description nor a README", (): void => {
    const empty: Repository = makeRepo({
      name: "empty",
      description: null,
      hasReadme: false,
    });
    expect(names(curateProjects([empty, visible("app")], base, NOW))).toEqual([
      "app",
    ]);
  });

  it("keeps repositories that have only a README or only a description", (): void => {
    const onlyReadme: Repository = makeRepo({
      name: "only-readme",
      description: null,
      hasReadme: true,
    });
    const onlyDescription: Repository = makeRepo({
      name: "only-desc",
      description: "Has a description",
      hasReadme: false,
    });
    expect(
      names(curateProjects([onlyReadme, onlyDescription], base, NOW)).sort(),
    ).toEqual(["only-desc", "only-readme"]);
  });

  it("returns an empty list when there is nothing to show", (): void => {
    expect(curateProjects([], base, NOW)).toEqual([]);
  });
});

describe("curateProjects: exclusion list", (): void => {
  it("never shows an excluded repository, even when it has the highest score", (): void => {
    const star: Repository = visible("old-experiment", {
      homepage: "https://x.dev",
      topics: ["a", "b", "c"],
      pushedAt: NOW.toISOString(),
    });
    const result: Project[] = curateProjects(
      [star, visible("plain")],
      { ...base, exclude: ["old-experiment"] },
      NOW,
    );
    expect(names(result)).toEqual(["plain"]);
  });

  it("matches names without regard to upper or lower case", (): void => {
    const result: Project[] = curateProjects(
      [visible("Secret-App")],
      { ...base, exclude: ["secret-app"] },
      NOW,
    );
    expect(result).toEqual([]);
  });

  it("wins over pin when a name is in both lists", (): void => {
    const result: Project[] = curateProjects(
      [visible("both"), visible("other")],
      { ...base, exclude: ["both"], pin: ["both"] },
      NOW,
    );
    expect(names(result)).toEqual(["other"]);
  });
});

describe("curateProjects: pinned repositories", (): void => {
  const strong: Repository = visible("c-strong", {
    homepage: "https://x.dev",
    pushedAt: NOW.toISOString(),
  });

  it("puts pinned repositories first, in the given order", (): void => {
    const result: Project[] = curateProjects(
      [visible("a"), visible("b"), strong],
      { ...base, pin: ["b", "a"] },
      NOW,
    );
    expect(names(result)).toEqual(["b", "a", "c-strong"]);
    expect(result.map((project) => project.pinned)).toEqual([
      true,
      true,
      false,
    ]);
  });

  it("lets a pin override the default hidden", (): void => {
    const forked: Repository = visible("forked", { isFork: true });
    const result: Project[] = curateProjects(
      [forked, strong],
      { ...base, pin: ["forked"] },
      NOW,
    );
    expect(names(result)).toEqual(["forked", "c-strong"]);
  });

  it("ignores pinned names that do not exist and repeated names", (): void => {
    const result: Project[] = curateProjects(
      [visible("a")],
      { ...base, pin: ["ghost", "a", "A"] },
      NOW,
    );
    expect(names(result)).toEqual(["a"]);
  });

  it("does not repeat a pinned repository in the ranked part", (): void => {
    const result: Project[] = curateProjects(
      [visible("a"), visible("b")],
      { ...base, pin: ["a"] },
      NOW,
    );
    expect(names(result).filter((name) => name === "a")).toHaveLength(1);
  });
});

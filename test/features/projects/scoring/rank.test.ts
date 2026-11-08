import { describe, expect, it } from "vitest";
import {
  rankRepositories,
  type ScoredRepository,
} from "@/features/projects/scoring/score";
import type { Repository } from "@/features/projects/types";
import { daysAgo, makeRepo, NOW } from "../../../helpers/repo-factory";

const README_POINTS: number = 20;
const OLDER_PUSH_DAYS: number = 1000;
const NEWER_PUSH_DAYS: number = 900;

const names = (ranked: ScoredRepository[]): string[] =>
  ranked.map((item: ScoredRepository): string => item.repository.name);

describe("rankRepositories", (): void => {
  it("orders by score, highest first", (): void => {
    const ranked: ScoredRepository[] = rankRepositories(
      [
        makeRepo({ name: "bare" }),
        makeRepo({ name: "demo", homepage: "https://demo.dev" }),
        makeRepo({ name: "readme", hasReadme: true }),
      ],
      NOW,
    );
    expect(names(ranked)).toEqual(["demo", "readme", "bare"]);
  });

  it("breaks a tie with the most recent push", (): void => {
    const ranked: ScoredRepository[] = rankRepositories(
      [
        makeRepo({ name: "older", pushedAt: daysAgo(OLDER_PUSH_DAYS) }),
        makeRepo({ name: "newer", pushedAt: daysAgo(NEWER_PUSH_DAYS) }),
      ],
      NOW,
    );
    expect(names(ranked)).toEqual(["newer", "older"]);
  });

  it("breaks the remaining ties alphabetically by name", (): void => {
    const sameDate: string = daysAgo(OLDER_PUSH_DAYS);
    const ranked: ScoredRepository[] = rankRepositories(
      [
        makeRepo({ name: "zeta", pushedAt: sameDate }),
        makeRepo({ name: "alpha", pushedAt: sameDate }),
      ],
      NOW,
    );
    expect(names(ranked)).toEqual(["alpha", "zeta"]);
  });

  it("carries the score and the breakdown with each repository", (): void => {
    const [first]: ScoredRepository[] = rankRepositories(
      [makeRepo({ name: "a", hasReadme: true })],
      NOW,
    );
    expect(first?.score).toBe(README_POINTS);
    expect(first?.breakdown.readme).toBe(README_POINTS);
  });

  it("returns an empty list for no repositories", (): void => {
    expect(rankRepositories([], NOW)).toEqual([]);
  });

  it("is stable regardless of the input order", (): void => {
    const repos: Repository[] = ["a", "b", "c", "d"].map(
      (name: string): Repository => makeRepo({ name }),
    );
    const forward: string[] = names(rankRepositories(repos, NOW));
    const backward: string[] = names(
      rankRepositories([...repos].reverse(), NOW),
    );
    expect(forward).toEqual(backward);
  });
});

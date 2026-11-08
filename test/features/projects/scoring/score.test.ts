import { describe, expect, it } from "vitest";
import { scoreRepository } from "@/features/projects/scoring/score";
import { makeRepo, NOW } from "../../../helpers/repo-factory";

type ScoredRepository = ReturnType<typeof scoreRepository>;

const DEMO_POINTS: number = 25;
const README_POINTS: number = 20;
const DESCRIPTION_POINTS: number = 15;
const MIN_DESCRIPTION_LENGTH: number = 20;
const NO_POINTS: number = 0;

describe("scoreRepository: completeness signals", (): void => {
  it("gives 25 points for a live demo", (): void => {
    const { breakdown }: ScoredRepository = scoreRepository(
      makeRepo({ homepage: "https://demo.dev" }),
      NOW,
    );
    expect(breakdown.demo).toBe(DEMO_POINTS);
  });

  it("gives no points when the homepage is empty or blank", (): void => {
    expect(
      scoreRepository(makeRepo({ homepage: null }), NOW).breakdown.demo,
    ).toBe(NO_POINTS);
    expect(
      scoreRepository(makeRepo({ homepage: "  " }), NOW).breakdown.demo,
    ).toBe(NO_POINTS);
  });

  it("gives 20 points for a README", (): void => {
    expect(
      scoreRepository(makeRepo({ hasReadme: true }), NOW).breakdown.readme,
    ).toBe(README_POINTS);
    expect(
      scoreRepository(makeRepo({ hasReadme: false }), NOW).breakdown.readme,
    ).toBe(NO_POINTS);
  });

  it("gives 15 points for a description of at least 20 characters", (): void => {
    const long: ScoredRepository = scoreRepository(
      makeRepo({ description: "x".repeat(MIN_DESCRIPTION_LENGTH) }),
      NOW,
    );
    const short: ScoredRepository = scoreRepository(
      makeRepo({ description: "x".repeat(MIN_DESCRIPTION_LENGTH - 1) }),
      NOW,
    );
    const none: ScoredRepository = scoreRepository(
      makeRepo({ description: null }),
      NOW,
    );
    expect(long.breakdown.description).toBe(DESCRIPTION_POINTS);
    expect(short.breakdown.description).toBe(NO_POINTS);
    expect(none.breakdown.description).toBe(NO_POINTS);
  });
});

import { describe, expect, it } from "vitest";
import { scoreRepository } from "@/features/projects/scoring/score";
import { daysAgo, makeRepo, NOW } from "../../../helpers/repo-factory";

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

const RECENCY_POINTS: number = 20;
const RECENCY_HALF_POINTS: number = 10;
const RECENCY_FULL_DAYS: number = 90;
const RECENCY_ZERO_DAYS: number = 730;
const RECENCY_MIDPOINT_DAYS: number = 410;
const RECENT_PUSH_DAYS: number = 10;
const FUTURE_PUSH_DAYS: number = -5;
const VERY_OLD_PUSH_DAYS: number = 3000;

describe("scoreRepository: recent activity", (): void => {
  const recency = (days: number): number =>
    scoreRepository(makeRepo({ pushedAt: daysAgo(days) }), NOW).breakdown
      .recency;

  it("gives the full 20 points within 90 days", (): void => {
    expect(recency(0)).toBe(RECENCY_POINTS);
    expect(recency(RECENT_PUSH_DAYS)).toBe(RECENCY_POINTS);
    expect(recency(RECENCY_FULL_DAYS)).toBe(RECENCY_POINTS);
  });

  it("decays linearly between 90 and 730 days", (): void => {
    expect(recency(RECENCY_MIDPOINT_DAYS)).toBe(RECENCY_HALF_POINTS);
    expect(recency(RECENCY_FULL_DAYS + 1)).toBe(RECENCY_POINTS);
    expect(recency(RECENCY_ZERO_DAYS - 1)).toBe(NO_POINTS);
  });

  it("gives zero from 730 days on", (): void => {
    expect(recency(RECENCY_ZERO_DAYS)).toBe(NO_POINTS);
    expect(recency(VERY_OLD_PUSH_DAYS)).toBe(NO_POINTS);
  });

  it("treats a push date in the future as fully recent", (): void => {
    expect(recency(FUTURE_PUSH_DAYS)).toBe(RECENCY_POINTS);
  });

  it("gives zero for an invalid date instead of failing", (): void => {
    expect(
      scoreRepository(makeRepo({ pushedAt: "not a date" }), NOW).breakdown
        .recency,
    ).toBe(NO_POINTS);
  });
});

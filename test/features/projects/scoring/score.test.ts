import { describe, expect, it } from "vitest";
import { scoreRepository } from "@/features/projects/scoring/score";
import type { Repository } from "@/features/projects/types";
import { daysAgo, makeRepo, NOW } from "../../../helpers/repo-factory";

type ScoredRepository = ReturnType<typeof scoreRepository>;

const DEMO_POINTS: number = 25;
const README_POINTS: number = 20;
const DESCRIPTION_POINTS: number = 15;
const MIN_DESCRIPTION_LENGTH: number = 20;
const NO_POINTS: number = 0;
const TOPICS_FULL_POINTS: number = 10;
const TOPICS_ONE_POINTS: number = 3;
const TOPICS_TWO_POINTS: number = 7;
const TOPICS_FOR_FULL: number = 3;
const EXTRA_TOPICS_COUNT: number = 8;
const RECENCY_POINTS: number = 20;
const RECENCY_HALF_POINTS: number = 10;
const RECENCY_FULL_DAYS: number = 90;
const RECENCY_ZERO_DAYS: number = 730;
const RECENCY_MIDPOINT_DAYS: number = 410;
const RECENT_PUSH_DAYS: number = 10;
const FUTURE_PUSH_DAYS: number = -5;
const VERY_OLD_PUSH_DAYS: number = 3000;
const POPULARITY_FULL_POINTS: number = 10;
const POPULARITY_SIX_POINTS: number = 6;
const TEN_STARS: number = 10;
const EIGHT_STARS: number = 8;
const TWO_FORKS: number = 2;
const POPULARITY_CAP_STARS: number = 50;
const HUGE_STARS: number = 10_000;
const MIN_COMPLETE_SCORE: number = 85;
const COMPLETE_REPO_PUSH_DAYS: number = 10;
const DAYS_PER_YEAR: number = 365;
const OLD_REPO_YEARS: number = 3;
const MID_AGE_PUSH_DAYS: number = 200;
const RECENT_PUSH_DAYS_FOR_CLOCK: number = 60;
const CLOCK_SHIFT_DAYS: number = 400;
const FAMOUS_FORKS: number = 500;
const MS_PER_SECOND_FOR_DAYS: number = 1000;
const MS_PER_DAY: number = 24 * 60 * 60 * MS_PER_SECOND_FOR_DAYS;

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

describe("scoreRepository: topics", (): void => {
  const topics = (count: number): number =>
    scoreRepository(
      makeRepo({
        topics: Array.from(
          { length: count },
          (_: unknown, index: number): string => `t${index}`,
        ),
      }),
      NOW,
    ).breakdown.topics;

  it("is proportional up to 3 topics", (): void => {
    expect(topics(0)).toBe(NO_POINTS);
    expect(topics(1)).toBe(TOPICS_ONE_POINTS);
    expect(topics(2)).toBe(TOPICS_TWO_POINTS);
    expect(topics(TOPICS_FOR_FULL)).toBe(TOPICS_FULL_POINTS);
  });

  it("does not give more for additional topics", (): void => {
    expect(topics(EXTRA_TOPICS_COUNT)).toBe(TOPICS_FULL_POINTS);
  });
});

describe("scoreRepository: popularity", (): void => {
  const popularity = (stars: number, forks: number = 0): number =>
    scoreRepository(makeRepo({ stars, forks }), NOW).breakdown.popularity;

  it("is zero without stars or forks", (): void => {
    expect(popularity(0)).toBe(NO_POINTS);
  });

  it("grows with stars and forks, quickly at first", (): void => {
    expect(popularity(1)).toBe(2);
    expect(popularity(TEN_STARS)).toBe(POPULARITY_SIX_POINTS);
    expect(popularity(EIGHT_STARS, TWO_FORKS)).toBe(POPULARITY_SIX_POINTS);
  });

  it("stops growing at the cap", (): void => {
    expect(popularity(POPULARITY_CAP_STARS)).toBe(POPULARITY_FULL_POINTS);
    expect(popularity(HUGE_STARS)).toBe(POPULARITY_FULL_POINTS);
  });
});

describe("scoreRepository: total", (): void => {
  it("scores a complete, active repository high and shows where the points come from", (): void => {
    const result: ScoredRepository = scoreRepository(
      makeRepo({
        homepage: "https://demo.dev",
        hasReadme: true,
        description:
          "A complete app with authentication, tests and documentation",
        topics: ["a", "b", "c", "d"],
        pushedAt: daysAgo(COMPLETE_REPO_PUSH_DAYS),
      }),
      NOW,
    );
    expect(result.score).toBeGreaterThanOrEqual(MIN_COMPLETE_SCORE);
    expect(result.breakdown).toEqual({
      demo: DEMO_POINTS,
      readme: README_POINTS,
      description: DESCRIPTION_POINTS,
      recency: RECENCY_POINTS,
      topics: TOPICS_FULL_POINTS,
      popularity: NO_POINTS,
    });
  });

  it("scores a bare, old repository zero", (): void => {
    expect(
      scoreRepository(
        makeRepo({ pushedAt: daysAgo(OLD_REPO_YEARS * DAYS_PER_YEAR) }),
        NOW,
      ).score,
    ).toBe(NO_POINTS);
  });

  it("never gives a famous repository without anything else more than the popularity weight", (): void => {
    const result: ScoredRepository = scoreRepository(
      makeRepo({ stars: HUGE_STARS, forks: FAMOUS_FORKS }),
      NOW,
    );
    expect(result.breakdown.popularity).toBeLessThanOrEqual(
      POPULARITY_FULL_POINTS,
    );
    expect(result.score).toBeLessThanOrEqual(POPULARITY_FULL_POINTS);
  });

  it("is deterministic for the same input and date", (): void => {
    const repo: Repository = makeRepo({
      homepage: "https://x.dev",
      pushedAt: daysAgo(MID_AGE_PUSH_DAYS),
    });
    expect(scoreRepository(repo, NOW)).toEqual(scoreRepository(repo, NOW));
  });

  it("changes with the date it is evaluated at (the clock is injected)", (): void => {
    const repo: Repository = makeRepo({
      pushedAt: daysAgo(RECENT_PUSH_DAYS_FOR_CLOCK),
    });
    const later: Date = new Date(NOW.getTime() + CLOCK_SHIFT_DAYS * MS_PER_DAY);
    expect(scoreRepository(repo, later).breakdown.recency).toBeLessThan(
      scoreRepository(repo, NOW).breakdown.recency,
    );
  });
});

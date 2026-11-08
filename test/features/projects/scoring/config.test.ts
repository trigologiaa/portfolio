import { describe, expect, it } from "vitest";
import { scoringConfig } from "@/features/projects/scoring/config";

const EXPECTED_TOTAL_WEIGHT: number = 100;
const EXPECTED_RECENCY_FULL_DAYS: number = 90;
const EXPECTED_RECENCY_ZERO_DAYS: number = 730;

describe("scoringConfig", (): void => {
  it("has weights that add up to exactly 100", (): void => {
    const total: number = Object.values<number>(scoringConfig.weights).reduce(
      (sum: number, weight: number): number => sum + weight,
      0,
    );
    expect(total).toBe(EXPECTED_TOTAL_WEIGHT);
  });

  it("decays the recency between 90 days and two years", (): void => {
    expect(scoringConfig.recencyFullDays).toBe(EXPECTED_RECENCY_FULL_DAYS);
    expect(scoringConfig.recencyZeroDays).toBe(EXPECTED_RECENCY_ZERO_DAYS);
  });
});

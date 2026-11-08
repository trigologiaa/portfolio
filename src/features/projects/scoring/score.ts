import type { Repository } from "../types";
import { type ScoringConfig, scoringConfig } from "./config";

export interface ScoreBreakdown {
  demo: number;
  readme: number;
  description: number;
  recency: number;
  topics: number;
  popularity: number;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdown;
}

export function scoreRepository(
  repo: Repository,
  now: Date,
  config: ScoringConfig = scoringConfig,
): ScoreResult {
  const { weights } = config;
  void now;
  const breakdown: ScoreBreakdown = {
    demo: repo.homepage?.trim() ? weights.demo : 0,
    readme: repo.hasReadme ? weights.readme : 0,
    description:
      (repo.description?.trim().length ?? 0) >= config.descriptionMinLength
        ? weights.description
        : 0,
    recency: 0,
    topics: 0,
    popularity: 0,
  };
  const score: number = Object.values(breakdown).reduce(
    (sum: number, points: number): number => sum + points,
    0,
  );
  return {
    score,
    breakdown,
  };
}

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

const MS_PER_SECOND: number = 1000;
const DAY_MS: number = 24 * 60 * 60 * MS_PER_SECOND;

function recencyPoints(
  pushedAt: string,
  now: Date,
  config: ScoringConfig,
): number {
  const pushed: number = new Date(pushedAt).getTime();
  if (Number.isNaN(pushed)) {
    return 0;
  }
  const days: number = (now.getTime() - pushed) / DAY_MS;
  if (days <= config.recencyFullDays) {
    return config.weights.recency;
  }
  if (days >= config.recencyZeroDays) {
    return 0;
  }
  const remaining: number =
    (config.recencyZeroDays - days) /
    (config.recencyZeroDays - config.recencyFullDays);
  return Math.round(config.weights.recency * remaining);
}

export function scoreRepository(
  repo: Repository,
  now: Date,
  config: ScoringConfig = scoringConfig,
): ScoreResult {
  const { weights } = config;
  const breakdown: ScoreBreakdown = {
    demo: repo.homepage?.trim() ? weights.demo : 0,
    readme: repo.hasReadme ? weights.readme : 0,
    description:
      (repo.description?.trim().length ?? 0) >= config.descriptionMinLength
        ? weights.description
        : 0,
    recency: recencyPoints(repo.pushedAt, now, config),
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

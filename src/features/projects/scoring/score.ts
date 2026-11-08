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

function topicsPoints(count: number, config: ScoringConfig): number {
  const ratio = Math.min(count, config.topicsForFull) / config.topicsForFull;
  return Math.round(config.weights.topics * ratio);
}

function popularityPoints(
  stars: number,
  forks: number,
  config: ScoringConfig,
): number {
  const total: number = Math.max(0, stars + forks);
  const ratio: number =
    Math.log10(1 + total) / Math.log10(1 + config.popularityCap);
  return Math.round(config.weights.popularity * Math.min(1, ratio));
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
    topics: topicsPoints(repo.topics.length, config),
    popularity: popularityPoints(repo.stars, repo.forks, config),
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

export type ScoredRepository = ScoreResult & { repository: Repository };

export function compareScored(
  a: ScoredRepository,
  b: ScoredRepository,
): number {
  if (a.score !== b.score) {
    return b.score - a.score;
  }
  const pushedA: number = new Date(a.repository.pushedAt).getTime() || 0;
  const pushedB: number = new Date(b.repository.pushedAt).getTime() || 0;
  if (pushedA !== pushedB) {
    return pushedB - pushedA;
  }
  return a.repository.name.localeCompare(b.repository.name);
}

export function rankRepositories(
  repos: readonly Repository[],
  now: Date,
  config: ScoringConfig = scoringConfig,
): ScoredRepository[] {
  return repos
    .map((repository) => ({
      repository,
      ...scoreRepository(repository, now, config),
    }))
    .sort(compareScored);
}

export const scoringConfig = {
  weights: {
    demo: 25,
    readme: 20,
    description: 15,
    recency: 20,
    topics: 10,
    popularity: 10,
  },
  descriptionMinLength: 20,
  recencyFullDays: 90,
  recencyZeroDays: 730,
  topicsForFull: 3,
  popularityCap: 50,
} as const;

export type ScoringConfig = typeof scoringConfig;

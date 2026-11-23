import z from "zod";
import type { Repository } from "./types";

export const repositorySchema: z.ZodType<Repository> = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  url: z.url(),
  homepage: z.string().nullable(),
  topics: z.array(z.string()),
  language: z.string().nullable(),
  languages: z.record(z.string(), z.number()),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  pushedAt: z.string().min(1),
  isFork: z.boolean(),
  isArchived: z.boolean(),
  hasReadme: z.boolean(),
});

export const repositoriesSchema: z.ZodType<Repository[]> =
  z.array(repositorySchema);

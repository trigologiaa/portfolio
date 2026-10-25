import z, { type ZodObject, type ZodString } from "zod";

const ISO_DATE_REGEX: RegExp =
  /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const DEFAULT_FEATURED_COUNT: number = 6;

const image: ZodObject = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const isoDate: ZodString = z.string().regex(ISO_DATE_REGEX, {
  message: "Use YYYY-MM or YYYY-MM-DD",
});

export const curationSchema: ZodObject = z.object({
  exclude: z.array(z.string().min(1)).default([]),
  pin: z.array(z.string().min(1)).default([]),
  featuredCount: z.number().min(1).default(DEFAULT_FEATURED_COUNT),
  selfRepo: z.string().min(1).default("portfolio"),
});

export const enrichmentSchema: ZodObject = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  demo: z.url().optional(),
  tags: z.array(z.string().min(1)).default([]),
  screenshots: z.array(image).default([]),
});

export const profileSchema: ZodObject = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  pitch: z.string().min(1),
  availability: z.string().min(1).optional(),
  photo: image.optional(),
  email: z.email(),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
  }),
  highlights: z.array(z.string().min(1)).default([]),
});

export const stackItemSchema: ZodObject = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
  url: z.url().optional(),
});

export const stackSchema: ZodObject = z.object({
  categories: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        items: z.array(stackItemSchema).min(1),
      }),
    )
    .min(1),
});

export const timelineEntrySchema: ZodObject = z.object({
  id: z.string().min(1),
  type: z.enum(["education", "course", "work"]),
  title: z.string().min(1),
  organization: z.string().min(1),
  start: isoDate,
  end: isoDate.optional(),
  description: z.string().min(1),
  logo: image.optional(),
  url: z.url().optional(),
});

export const timelineSchema: ZodObject = z.object({
  entries: z.array(timelineEntrySchema),
});

export type Profile = z.output<typeof profileSchema>;
export type Stack = z.output<typeof stackSchema>;
export type TimelineEntry = z.output<typeof timelineEntrySchema>;
export type Timeline = z.output<typeof timelineSchema>;
export type ProjectEnrichmentFrontmatter = z.output<typeof enrichmentSchema>;
export type Curation = z.output<typeof curationSchema>;

import z, { type ZodObject, type ZodString, type ZodType } from "zod";

const ISO_DATE_REGEX: RegExp =
  /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const DEFAULT_FEATURED_COUNT: number = 6;

const image: ZodType<Image> = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const isoDate: ZodString = z.string().regex(ISO_DATE_REGEX, {
  message: "Use YYYY-MM or YYYY-MM-DD",
});

export interface Image {
  src: string;
  alt: string;
}

export interface Profile {
  name: string;
  headline: string;
  pitch: string;
  availability?: string | undefined;
  photo?: Image | undefined;
  email: string;
  links: {
    github: string;
    linkedin: string;
  };
  highlights: string[];
}

export interface StackItem {
  id: string;
  name: string;
  icon: string;
  url?: string | undefined;
}

export interface StackCategory {
  id: string;
  name: string;
  items: StackItem[];
}

export interface Stack {
  categories: StackCategory[];
}

export type TimelineEntryType = "education" | "course" | "work";

export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  title: string;
  organization: string;
  start: string;
  end?: string | undefined;
  description: string;
  logo?: Image | undefined;
  url?: string | undefined;
}

export interface Timeline {
  entries: TimelineEntry[];
}

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

export const profileSchema: ZodType<Profile> = z.object({
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

export const stackItemSchema: ZodType<StackItem> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
  url: z.url().optional(),
});

export const stackSchema: ZodType<Stack> = z.object({
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

export const timelineEntrySchema: ZodType<TimelineEntry> = z.object({
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

export const timelineSchema: ZodType<Timeline> = z.object({
  entries: z.array(timelineEntrySchema),
});

export type ProjectEnrichmentFrontmatter = z.output<typeof enrichmentSchema>;
export type Curation = z.output<typeof curationSchema>;

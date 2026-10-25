import z, { type ZodObject } from "zod";

const image: ZodObject = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
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

export type Profile = z.output<typeof profileSchema>;

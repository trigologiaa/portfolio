import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export interface ProfileLinks {
  github: string;
  linkedin: string;
}

export interface ProfileInput {
  name: string;
  headline: string;
  pitch: string;
  email: string;
  links: ProfileLinks;
  highlights?: string[];
}

export const validProfile: ProfileInput = {
  name: "Ada Lovelace",
  headline: "Full-stack developer",
  pitch: "I build things for the web.",
  email: "ada@example.com",
  links: {
    github: "https://github.com/ada",
    linkedin: "https://www.linkedin.com/in/ada",
  },
  highlights: ["Buenos Aires"],
};

export interface StackItemInput {
  id: string;
  name: string;
  icon: string;
  url?: string;
}

export interface StackCategoryInput {
  id: string;
  name: string;
  items: StackItemInput[];
}

export interface StackInput {
  categories: StackCategoryInput[];
}

export interface TimelineEntryInput {
  id: string;
  type: "education" | "course" | "work";
  title: string;
  organization: string;
  start: string;
  end?: string;
  description: string;
}

export interface TimelineInput {
  entries: TimelineEntryInput[];
}

export const validStackItem: StackItemInput = {
  id: "react",
  name: "React",
  icon: "react",
};

export const validStack: StackInput = {
  categories: [{ id: "frontend", name: "Frontend", items: [validStackItem] }],
};

export const validTimelineEntry: TimelineEntryInput = {
  id: "uni",
  type: "education",
  title: "BSc in Computer Science",
  organization: "University",
  start: "2020-03",
  description: "Studies.",
};

export const validTimeline: TimelineInput = {
  entries: [validTimelineEntry],
};

interface LocaleOverrides {
  profile?: unknown;
  stack?: unknown;
  timeline?: unknown;
  about?: string | null;
}

export function makeContentRoot(
  overrides: Partial<Record<"en" | "es", LocaleOverrides>> = {},
): string {
  const root = mkdtempSync(path.join(tmpdir(), "portfolio-conent-"));
  for (const locale of ["en", "es"] as const) {
    const directory = path.join(root, locale);
    mkdirSync(directory, { recursive: true });
    const custom = overrides[locale] ?? {};
    writeFileSync(
      path.join(directory, "profile.json"),
      JSON.stringify(custom.profile ?? validProfile),
    );
    writeFileSync(
      path.join(directory, "stack.json"),
      JSON.stringify(custom.stack ?? validStack),
    );
    writeFileSync(
      path.join(directory, "timeline.json"),
      JSON.stringify(custom.timeline ?? validTimeline),
    );
    if (custom.about !== null) {
      writeFileSync(
        path.join(directory, "about.mdx"),
        JSON.stringify(custom.about ?? "Hello, I am Ada"),
      );
    }
  }
  return root;
}

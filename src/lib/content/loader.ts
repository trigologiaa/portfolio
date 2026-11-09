import { readFileSync } from "node:fs";
import path from "node:path";
import type z from "zod";
import { routing } from "@/i18n/routing";
import {
  type Curation,
  curationSchema,
  type Profile,
  profileSchema,
  type Stack,
  stackSchema,
  type Timeline,
  timelineSchema,
} from "./schemas";

export type ContentErrorCode =
  | "unsupported_locale"
  | "missing_file"
  | "invalid_content";

export class ContentError extends Error {
  public readonly code: ContentErrorCode;

  public constructor(code: ContentErrorCode, message: string) {
    super(message);
    this.name = "ContentError";
    this.code = code;
  }
}

interface ContentText {
  text: string;
  label: string;
}

export const contentLocales: typeof routing.locales = routing.locales;
export type ContentLocale = (typeof contentLocales)[number];

function assertLocale(locale: string): asserts locale is ContentLocale {
  if (!(contentLocales as readonly string[]).includes(locale)) {
    throw new ContentError(
      "unsupported_locale",
      `Unsupported locale: "${locale}"`,
    );
  }
}

function readText(root: string, locale: string, fileName: string): ContentText {
  assertLocale(locale);
  const label: string = `content/${locale}/${fileName}`;
  try {
    return {
      text: readFileSync(path.join(root, locale, fileName), "utf8"),
      label,
    };
  } catch {
    throw new ContentError("missing_file", `${label}: file not found`);
  }
}

export function describeIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "(root)"} - ${issue.message}`)
    .join("; ");
}

function parseJsonWithSchema<S extends z.ZodType>(
  label: string,
  text: string,
  schema: S,
): z.output<S> {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ContentError("invalid_content", `${label}: invalid JSON`);
  }
  const result: z.ZodSafeParseResult<z.core.output<S>> = schema.safeParse(data);
  if (!result.success) {
    throw new ContentError(
      "invalid_content",
      `${label}: ${describeIssues(result.error)}`,
    );
  }
  return result.data;
}

function readJson<S extends z.ZodType>(
  root: string,
  locale: string,
  fileName: string,
  schema: S,
): z.output<S> {
  const { text, label } = readText(root, locale, fileName);
  return parseJsonWithSchema(label, text, schema);
}

export function loadAbout(root: string, locale: string): string {
  const { text, label } = readText(root, locale, "about.mdx");
  if (text.trim() === "") {
    throw new ContentError("invalid_content", `${label}: file is empty`);
  }
  return text;
}

export function loadProfile(root: string, locale: string): Profile {
  return readJson(root, locale, "profile.json", profileSchema);
}

export function loadStack(root: string, locale: string): Stack {
  return readJson(root, locale, "stack.json", stackSchema);
}

export function loadTimeline(root: string, locale: string): Timeline {
  return readJson(root, locale, "timeline.json", timelineSchema);
}

export function loadCuration(root: string): Curation {
  let text: string;
  try {
    text = readFileSync(path.join(root, "curation.json"), "utf8");
  } catch {
    return curationSchema.parse({});
  }
  return parseJsonWithSchema("content/curation.json", text, curationSchema);
}

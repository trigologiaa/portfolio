import { readFileSync } from "node:fs";
import path from "node:path";
import type z from "zod";
import { routing } from "@/i18n/routing";
import {
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

function readJson<S extends z.ZodType>(
  root: string,
  locale: string,
  fileName: string,
  schema: S,
): z.output<S> {
  const { text, label }: ContentText = readText(root, locale, fileName);
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ContentError("invalid_content", `${label}: invalid JSON`);
  }
  const result: z.ZodSafeParseResult<z.output<S>> = schema.safeParse(data);
  if (!result.success) {
    const issues: string = result.error.issues
      .map(
        (issue: z.core.$ZodIssue): string =>
          `${issue.path.join(".") || "(root)"} — ${issue.message}`,
      )
      .join("; ");
    throw new ContentError("invalid_content", `${label}: ${issues}`);
  }
  return result.data;
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

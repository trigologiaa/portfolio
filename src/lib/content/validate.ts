import {
  ContentError,
  type ContentLocale,
  contentLocales,
  loadAbout,
  loadProfile,
  loadStack,
  loadTimeline,
} from "./loader";
import type { Profile, Stack, Timeline } from "./schemas";

function attempt<T>(errors: string[], run: () => T): T | undefined {
  try {
    return run();
  } catch (error) {
    if (error instanceof ContentError) {
      errors.push(error.message);
      return undefined;
    }
    throw error;
  }
}

function compareIds(
  label: string,
  idsByLocale: Partial<Record<ContentLocale, string[]>>,
): string[] {
  const errors: string[] = [];
  for (const a of contentLocales) {
    for (const b of contentLocales) {
      const idsA = idsByLocale[a];
      const idsB = idsByLocale[b];
      if (a === b || !idsA || !idsB) {
        continue;
      }
      for (const id of idsA) {
        if (!idsB.includes(id)) {
          errors.push(
            `${label}: id "${id}" exists in ${a} but is missing in ${b}`,
          );
        }
      }
    }
  }
  return errors;
}

export function validateContent(root: string): string[] {
  const errors: string[] = [];
  const timelineIds: Partial<Record<ContentLocale, string[]>> = {};
  const stackIds: Partial<Record<ContentLocale, string[]>> = {};
  for (const locale of contentLocales) {
    attempt(errors, (): Profile => loadProfile(root, locale));
    attempt(errors, (): string => loadAbout(root, locale));
    const timeline = attempt(
      errors,
      (): Timeline => loadTimeline(root, locale),
    );
    if (timeline) {
      timelineIds[locale] = timeline.entries.map((entry) => entry.id);
    }
    const stack: Stack | undefined = attempt(
      errors,
      (): Stack => loadStack(root, locale),
    );
    if (stack) {
      stackIds[locale] = stack.categories.flatMap((category) => [
        category.id,
        ...category.items.map((item) => `${category.id}/${item.id}`),
      ]);
    }
  }
  errors.push(...compareIds("timeline", timelineIds));
  errors.push(...compareIds("stack", stackIds));
  return errors;
}

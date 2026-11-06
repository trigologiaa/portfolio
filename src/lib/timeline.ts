import type { TimelineEntry } from "./content";

const ONGOING: string = "9999-12";
export const TYPE_ORDER = ["education", "course", "work"] as const;

export function sortEntries(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => {
    if (a.start !== b.start) {
      return a.start < b.start ? 1 : -1;
    }
    const endA = a.end ?? ONGOING;
    const endB = b.end ?? ONGOING;
    if (endA !== endB) {
      return endA < endB ? 1 : -1;
    }
    return a.id.localeCompare(b.id);
  });
}

export function availableTypes(
  entries: TimelineEntry[],
): TimelineEntry["type"][] {
  return TYPE_ORDER.filter((type) =>
    entries.some((entry) => entry.type === type),
  );
}

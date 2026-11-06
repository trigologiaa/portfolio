import type { TimelineEntry } from "./content";

const ONGOING: string = "9999-12";
export const TYPE_ORDER = ["education", "course", "work"] as const;

function formatMonth(isoDate: string, locale: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  if (
    year === undefined ||
    month === undefined ||
    Number.isNaN(year) ||
    Number.isNaN(month)
  ) {
    throw new Error(`Invalid ISO date: "${isoDate}" (expected YYYY-MM)`);
  }
  const date: Date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function availableTypes(
  entries: TimelineEntry[],
): TimelineEntry["type"][] {
  return TYPE_ORDER.filter((type) =>
    entries.some((entry) => entry.type === type),
  );
}

export function formatPeriod(
  period: { start: string; end?: string | undefined },
  locale: string,
  presentLabel: string,
): string {
  const start: string = formatMonth(period.start, locale);
  const end: string = period.end
    ? formatMonth(period.end, locale)
    : presentLabel;
  return `${start} - ${end}`;
}

export function sortEntries(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a: TimelineEntry, b: TimelineEntry) => {
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

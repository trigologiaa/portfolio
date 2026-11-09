export const navItems = [
  { id: "about" },
  { id: "projects" },
  { id: "stack" },
  { id: "experience" },
  { id: "contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

export function sectionHref(id: SectionId): string {
  return `/#${id}`;
}

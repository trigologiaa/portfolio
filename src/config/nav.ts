export const navItems = [
  { id: "projects" },
  { id: "about" },
  { id: "stack" },
  { id: "experience" },
  { id: "contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

export function sectionHref(id: SectionId): string {
  return `/#${id}`;
}

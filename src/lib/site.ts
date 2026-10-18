export const siteConfig = {
  name: "Gastón Ribero",
  description: "Personal portfolio",
} as const;

export function formatPageTitle(_title?: string): string {
  return `${siteConfig.name} - Portfolio`;
}

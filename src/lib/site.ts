export const siteConfig = {
  name: "Gastón Ribero",
  description: "Personal portfolio",
} as const;

export function formatPageTitle(title?: string): string {
  return title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} - Portfolio`;
}

import type { Profile } from "./content/schemas";

export interface SocialLink {
  label: string;
  href: string;
}

export function socialLinks(links: Profile["links"]): SocialLink[] {
  return [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
  ];
}

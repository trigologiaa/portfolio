export const flavors: readonly [string, string, string, string] = [
  "latte",
  "frappe",
  "macchiato",
  "mocha",
] as const;

export type Flavor = (typeof flavors)[number];

export type ThemeValue = Flavor | "system";

export type Darkness = "light" | "dark" | "darker" | "darkest";

export const flavorDarkness: Record<Flavor, Darkness> = {
  latte: "light",
  frappe: "dark",
  macchiato: "darker",
  mocha: "darkest",
};

export function systemFlavor(prefersDark: boolean): Flavor {
  return prefersDark ? "mocha" : "latte";
}

export function sanitizeTheme(value: string): ThemeValue {
  const foundFlavor = flavors.find((flavor: Flavor) => flavor === value);
  return foundFlavor ?? "system";
}

"use client";

import {
  ThemeProvider as NextThemesProvider,
  type UseThemeProps,
  useTheme,
} from "next-themes";
import { type ReactElement, type ReactNode, useEffect } from "react";
import { flavors, sanitizeTheme, systemFlavor } from "@/lib/theme";

const themeValues: Record<string, string> = {
  ...Object.fromEntries(flavors.map((flavor) => [flavor, flavor])),
  light: systemFlavor(false),
  dark: systemFlavor(true),
};

function ThemeSanitizer(): null {
  const { theme, setTheme }: UseThemeProps = useTheme();
  useEffect((): void => {
    if (theme !== undefined && theme !== sanitizeTheme(theme)) {
      setTheme("system");
    }
  }, [theme, setTheme]);
  return null;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={[...flavors]}
      value={themeValues}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSanitizer />
      {children}
    </NextThemesProvider>
  );
}

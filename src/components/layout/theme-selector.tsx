"use client";

import { Palette } from "lucide-react";
import { type UseThemeProps, useTheme } from "next-themes";
import type { ReactElement } from "react";
import { type Flavor, flavors, sanitizeTheme, systemFlavor } from "@/lib/theme";
import { useIsMounted } from "@/lib/use-is-mounted";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ThemeSelectorProps {
  labels: {
    group: string;
    options: Record<Flavor, string>;
  };
}

export function ThemeSelector({ labels }: ThemeSelectorProps): ReactElement {
  const { theme, resolvedTheme, setTheme }: UseThemeProps = useTheme();
  const mounted: boolean = useIsMounted();
  const stored: string = sanitizeTheme(theme ?? "");
  const active: Flavor =
    stored === "system" ? systemFlavor(resolvedTheme === "dark") : stored;
  const activeLabel = mounted ? labels.options[active] : labels.group;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={`${labels.group}: ${activeLabel}`}
        >
          <Palette aria-hidden="true" />
          <span className="hidden sm:inline">{activeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={mounted ? active : ""}
          onValueChange={(value: string): void =>
            setTheme(sanitizeTheme(value))
          }
        >
          {flavors.map((flavor) => (
            <DropdownMenuRadioItem key={flavor} value={flavor}>
              {labels.options[flavor]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

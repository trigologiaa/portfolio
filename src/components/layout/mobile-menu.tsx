"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactElement, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";

export function MobileMenu(): ReactElement {
  const t: ReturnType<typeof useTranslations<"Nav">> = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={t("openMenu")}
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{t("menu")}</SheetTitle>
          <SheetDescription className="sr-only">{t("main")}</SheetDescription>
        </SheetHeader>
        <NavLinks className="px-4" onNavigate={(): void => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

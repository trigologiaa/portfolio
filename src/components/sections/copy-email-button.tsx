"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { type JSX, useState } from "react";
import { type CopyResult, copyToClipboard } from "@/lib/clipboard";
import { Button } from "../ui/button";

export function CopyEmailButton({ email }: { email: string }): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Contact">> =
    useTranslations("Contact");
  const [result, setResult] = useState<CopyResult | null>(null);
  async function handleClick(): Promise<void> {
    setResult(await copyToClipboard(email));
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="outline" onClick={handleClick}>
        {result === "copied" ? (
          <Check aria-label="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {t("copy")}
      </Button>
      <output className="text-sm text-muted-foreground">
        {result === "copied" && t("copied")}
      </output>
    </div>
  );
}

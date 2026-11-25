"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { type JSX, type RefObject, useRef, useState } from "react";
import { type CopyResult, copyToClipboard } from "@/lib/clipboard";
import { Button } from "../ui/button";

export function CopyEmailButton({ email }: { email: string }): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Contact">> =
    useTranslations("Contact");
  const [result, setResult] = useState<CopyResult | null>(null);
  const addressRef: RefObject<HTMLSpanElement | null> =
    useRef<HTMLSpanElement>(null);
  async function handleClick(): Promise<void> {
    const outcome: CopyResult = await copyToClipboard(email);
    setResult(outcome);
    if (outcome === "failed" && addressRef.current) {
      window.getSelection()?.selectAllChildren(addressRef.current);
    }
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
      <span ref={addressRef} className="sr-only">
        {email}
      </span>
      <output className="text-sm text-muted-foreground">
        {result === "copied" && t("copied")}
        {result === "failed" && t("copyFailed")}
      </output>
    </div>
  );
}

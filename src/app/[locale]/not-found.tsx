import { useTranslations } from "next-intl";
import type React from "react";
import { Link } from "@/i18n/navigation";

export default function NotFound(): React.JSX.Element {
  const t = useTranslations("NotFound");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link href="/" className="text-primary underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  );
}

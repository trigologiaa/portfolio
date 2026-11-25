import { useTranslations } from "next-intl";
import type { JSX, ReactNode } from "react";
import type { SocialLink } from "@/lib/social-links";
import { CopyEmailButton } from "./copy-email-button";

interface ContactSectionProps {
  email: string;
  links: SocialLink[];
  children?: ReactNode;
}

export function ContactSection({
  email,
  links,
  children,
}: ContactSectionProps): JSX.Element {
  const t: ReturnType<typeof useTranslations<"Contact">> =
    useTranslations("Contact");
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 py-16"
    >
      <h2 id="contact-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-prose text-muted-foreground">{t("intro")}</p>
      <div className="mt-6 flex flex-col gap-4">
        <a
          href={`mailto:${email}`}
          className="w-fit text-lg font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          {email}
        </a>
        <CopyEmailButton email={email} />
      </div>
      <ul aria-label={t("elsewhere")} className="mt-6 flex flex-wrap gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {children && <div className="mt-10">{children}</div>}
    </section>
  );
}

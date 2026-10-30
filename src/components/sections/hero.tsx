import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Profile } from "@/lib/content/schemas";

interface HeroProps {
  profile: Pick<
    Profile,
    "name" | "headline" | "pitch" | "availability" | "photo"
  >;
  cv?: {
    href: string;
  };
}

export function Hero({ profile, cv }: HeroProps): ReactElement {
  const t: ReturnType<typeof useTranslations<"Hero">> = useTranslations("Hero");
  return (
    <section
      aria-labelledby="hero-title"
      className="flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-24"
    >
      <div className="flex max-w-2xl flex-col gap-4">
        {profile.availability && (
          <p className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            {profile.availability}
          </p>
        )}
        <h1
          id="hero-title"
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          {profile.name}
        </h1>
        <p className="text-xl text-muted-foreground">{profile.headline}</p>
        <p className="max-w-prose">{profile.pitch}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/#projects">{t("viewProjects")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#contact">{t("contact")}</Link>
          </Button>
          {cv && (
            <Button asChild size="lg" variant="ghost">
              <a href={cv.href} download>
                {t("downloadCv")}
              </a>
            </Button>
          )}
        </div>
      </div>
      {profile.photo && (
        <Image
          src={profile.photo.src}
          alt={profile.photo.alt}
          width={192}
          height={192}
          priority
          className="size-40 rounded-full object-cover md:size-48"
        />
      )}
    </section>
  );
}

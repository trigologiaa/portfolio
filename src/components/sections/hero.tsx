import type { ReactElement } from "react";
import type { Profile } from "@/lib/content";

interface HeroProps {
  profile: Pick<
    Profile,
    "name" | "headline" | "pitch" | "availability" | "photo"
  >;
}

export function Hero({ profile }: HeroProps): ReactElement {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex flex-col gap-4 py-16 md:py-24"
    >
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
      <p className="text-xl text-muted-foreground">{profile.pitch}</p>
    </section>
  );
}

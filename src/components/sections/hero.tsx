import type { Profile } from "@/lib/content";
import type { ReactElement } from "react";

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

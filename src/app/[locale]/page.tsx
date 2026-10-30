import { getTranslations } from "next-intl/server";
import type { JSX } from "react/jsx-runtime";
import { Mdx } from "@/components/mdx/mdx";
import { AboutSection } from "@/components/sections/about-section";
import { Hero } from "@/components/sections/hero";
import { getAbout, getProfile } from "@/lib/content";

function Placeholder({
  id,
  title,
}: {
  id: string;
  title: string;
}): JSX.Element {
  return (
    <section id={id} className="scroll-mt-20 py-24">
      <h2 className="text-2xl font-semibold">{title}</h2>
    </section>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const profile = getProfile(locale);
  const aboutSource = getAbout(locale);
  return (
    <main id="content" className="mx-auto max-w-5xl px-4">
      <Hero profile={profile} />
      <Placeholder id="projects" title={nav("projects")} />
      <AboutSection highlights={profile.highlights}>
        <Mdx source={aboutSource} />
      </AboutSection>
      <Placeholder id="stack" title={nav("stack")} />
      <Placeholder id="experience" title={nav("experience")} />
      <Placeholder id="contact" title={nav("contact")} />
    </main>
  );
}

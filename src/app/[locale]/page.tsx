import { getTranslations } from "next-intl/server";
import { navItems } from "@/config/nav";
import { siteConfig } from "@/lib/site";

export default async function Home(): Promise<React.JSX.Element> {
  const nav = await getTranslations("Nav");
  const home = await getTranslations("Home");
  return (
    <main id="content" className="mx-auto max-w-5xl px-4">
      <section className="flex min-h-[60vh] flex-col justify-center gap-4 py-16">
        <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
        <p className="text-muted-foreground">{home("tagline")}</p>
      </section>
      {navItems.map(({ id }) => (
        <section key={id} id={id} className="scroll-mt-20 py-24">
          <h2 className="text-2xl font-semibold">{nav(id)}</h2>
        </section>
      ))}
    </main>
  );
}

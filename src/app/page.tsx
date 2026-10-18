import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
    </main>
  );
}

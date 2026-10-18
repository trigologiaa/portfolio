import type { JSX } from "react/jsx-runtime";
import { siteConfig } from "@/lib/site";

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
    </main>
  );
}

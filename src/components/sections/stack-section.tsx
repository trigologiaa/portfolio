"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { StackIcon } from "@/components/icons/stack-icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Stack } from "@/lib/content/schemas";

export function StackSection({ stack }: { stack: Stack }): ReactElement {
  const t: ReturnType<typeof useTranslations<"Stack">> =
    useTranslations("Stack");
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-20 py-16"
    >
      <h2 id="stack-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <Tabs defaultValue={stack.categories[0]?.id} className="mt-6">
        <TabsList className="w-full flex-wrap justify-start gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
          {stack.categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="min-h-11 flex-none rounded-full border-border px-4 text-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground dark:data-active:border-primary dark:data-active:bg-primary dark:data-active:text-primary-foreground after:hidden"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {stack.categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {category.items.map((item) => (
                <li key={item.id}>
                  <HoverCard openDelay={150} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        <StackIcon
                          name={item.icon}
                          className="size-6 shrink-0"
                        />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {t("officialSite")} ↗
                      </a>
                    </HoverCardContent>
                  </HoverCard>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

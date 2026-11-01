"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { StackIcon } from "@/components/icons/stack-icons";
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
        <TabsList className="h-auto flex-wrap justify-start">
          {stack.categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="min-h-11 px-4"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {stack.categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-4"
                >
                  <StackIcon name={item.icon} className="size-6 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-40% 0px -55% 0px",
};

function getTargetElements(joinedIds: string): HTMLElement[] {
  return joinedIds
    .split(",")
    .map((id: string): HTMLElement | null => document.getElementById(id))
    .filter(
      (element: HTMLElement | null): element is HTMLElement => element !== null,
    );
}

function processIntersections(
  entries: IntersectionObserverEntry[],
  setActive: Dispatch<SetStateAction<string | null>>,
): void {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      setActive(entry.target.id);
    } else {
      setActive((current: string | null): string | null =>
        current === entry.target.id ? null : current,
      );
    }
  }
}
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key: string = ids.join(",");
  useEffect((): (() => void) | undefined => {
    const elements: HTMLElement[] = getTargetElements(key);
    if (elements.length === 0) {
      return undefined;
    }
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        processIntersections(entries, setActive);
      },
      OBSERVER_OPTIONS,
    );
    for (const element of elements) {
      observer.observe(element);
    }
    return (): void => observer.disconnect();
  }, [key]);
  return active;
}

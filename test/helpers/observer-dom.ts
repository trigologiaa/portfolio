import { MockIntersectionObserver } from "./mock-intersection-observer";

export function getSection(id: string): HTMLElement {
  const section: HTMLElement | null = document.getElementById(id);
  if (section === null) {
    throw new Error(`Missing section: ${id}`);
  }
  return section;
}

export function getLatestObserver(): MockIntersectionObserver {
  const observer: MockIntersectionObserver | undefined =
    MockIntersectionObserver.instances.at(-1);
  if (observer === undefined) {
    throw new Error("No IntersectionObserver was created");
  }
  return observer;
}

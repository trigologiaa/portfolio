import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { MockIntersectionObserver } from "./helpers/mock-intersection-observer";

const originalConsoleError: typeof console.error = console.error;

const hasDom: boolean = typeof window !== "undefined";

beforeEach((): void => {
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]): void => {
    if (String(args[0]).includes("Encountered a script tag")) {
      return;
    }
    originalConsoleError(...args);
  });
  if (!hasDom) {
    return;
  }
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
      addListener: (): void => {},
      removeListener: (): void => {},
      dispatchEvent: (): boolean => false,
    }),
  });
  MockIntersectionObserver.clearInstances();
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

afterEach((): void => {
  vi.restoreAllMocks();
  if (!hasDom) {
    return;
  }
  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
});

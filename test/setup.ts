import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

const originalConsoleError: typeof console.error = console.error;

beforeEach((): void => {
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]): void => {
    if (String(args[0]).includes("Encountered a script tag")) {
      return;
    }
    originalConsoleError(...args);
  });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  globalThis.ResizeObserver ??= class {
    public observe(): void {}
    public unobserve(): void {}
    public disconnect(): void {}
  };
  Element.prototype.hasPointerCapture ??= (): boolean => false;
  Element.prototype.setPointerCapture ??= (): void => {};
  Element.prototype.releasePointerCapture ??= (): void => {};
  Element.prototype.scrollIntoView ??= (): void => {};
});

afterEach((): void => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("style");
});

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { renderWithProviders } from "../../render-with-providers";

const replace: Mock<(href: string, options?: { locale?: string }) => void> =
  vi.fn();

vi.mock(
  "@/i18n/navigation",
  (): {
    usePathname: () => string;
    useRouter: () => { replace: typeof replace };
  } => ({
    usePathname: () => "/projects",
    useRouter: () => ({ replace }),
  }),
);

beforeEach((): void => {
  replace.mockClear();
});

describe("LanguageSwitcher", (): void => {
  it("lists every language by its own name inside a labelled group", (): void => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "lang",
      "en",
    );
    expect(screen.getByRole("button", { name: "Español" })).toHaveAttribute(
      "lang",
      "es",
    );
  });
});

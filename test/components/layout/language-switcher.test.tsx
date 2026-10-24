import { screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
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

  it("marks the current language as pressed", (): void => {
    renderWithProviders(<LanguageSwitcher />, { locale: "es" });
    expect(screen.getByRole("button", { name: "Español" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("switches language keeping the current page", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);
    await user.click(screen.getByRole("button", { name: "Español" }));
    expect(replace).toHaveBeenCalledWith("/projects", { locale: "es" });
  });

  it("translates its label", (): void => {
    renderWithProviders(<LanguageSwitcher />, { locale: "es" });
    expect(screen.getByRole("group", { name: "Idioma" })).toBeInTheDocument();
  });
});

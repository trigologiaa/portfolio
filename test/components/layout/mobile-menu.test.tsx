import { screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { JSX } from "react/jsx-runtime";
import { describe, expect, it, vi } from "vitest";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { renderWithProviders } from "../../render-with-providers";

interface MockLinkProps {
  href: string;
  children: React.ReactNode;
}

function MockLink({ href, children, ...props }: MockLinkProps): JSX.Element {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

// biome-ignore lint/style/useNamingConvention: must match the real export name
vi.mock("@/i18n/navigation", (): { Link: typeof MockLink } => ({
  // biome-ignore lint/style/useNamingConvention: must match the real export name
  Link: MockLink,
}));

describe("MobileMenu", (): void => {
  it("starts closed and opens with the menu button", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    expect(
      screen.queryByRole("navigation", { name: "Main navigation" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
  });

  it("closes with Escape and returns focus to the menu button", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    const button: HTMLElement = screen.getByRole("button", {
      name: "Open menu",
    });
    await user.click(button);
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("navigation", { name: "Main navigation" }),
    ).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("closes after choosing a section", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<MobileMenu />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: "Contact" }));
    expect(
      screen.queryByRole("navigation", { name: "Main navigation" }),
    ).not.toBeInTheDocument();
  });
});

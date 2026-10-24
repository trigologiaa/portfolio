import { act, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type React from "react";
import type { JSX } from "react/jsx-runtime";
import { describe, expect, it, type Mock, vi } from "vitest";
import { NavLinks } from "@/components/layout/nav-links";
import { getLatestObserver, getSection } from "../../helpers/observer-dom";
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

vi.mock("@/i18n/navigation", () => ({
  // biome-ignore lint/style/useNamingConvention: must match the real export name
  Link: MockLink,
}));

describe("NavLinks", (): void => {
  it("renders a link to each section of the home page", (): void => {
    renderWithProviders(<NavLinks />);
    const nav: HTMLElement = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/#about",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("marks the link of the section in view with aria-current", (): void => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<section id="stack"></section>`,
    );
    renderWithProviders(<NavLinks />);
    act((): void => getLatestObserver().trigger(getSection("stack"), true));
    expect(screen.getByRole("link", { name: "Stack" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    getSection("stack").remove();
  });

  it("calls onNavigate when a link is clicked", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    const onNavigate: Mock<() => void> = vi.fn();
    renderWithProviders(<NavLinks onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "About" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("translates the labels", (): void => {
    renderWithProviders(<NavLinks />, { locale: "es" });
    expect(screen.getByRole("link", { name: "Sobre mí" })).toBeInTheDocument();
  });
});

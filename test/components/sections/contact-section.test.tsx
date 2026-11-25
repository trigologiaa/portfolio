import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactSection } from "@/components/sections/contact-section";
import { renderWithProviders } from "../../render-with-providers";

const links: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/ada" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ada" },
];

describe("ContactSection", (): void => {
  it("shows the heading and the invitation", (): void => {
    const { container } = renderWithProviders(
      <ContactSection email="ada@example.com" links={links} />,
    );
    expect(container.querySelector("section#contact")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Contact" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I would love to hear about it/),
    ).toBeInTheDocument();
  });

  it("offers the email as a mailto link, which does not need JavaScript", (): void => {
    renderWithProviders(
      <ContactSection email="ada@example.com" links={links} />,
    );
    expect(
      screen.getByRole("link", { name: "ada@example.com" }),
    ).toHaveAttribute("href", "mailto:ada@example.com");
  });

  it("links to the social profiles in a new tab without leaking the opener", (): void => {
    renderWithProviders(
      <ContactSection email="ada@example.com" links={links} />,
    );
    for (const { label, href } of links) {
      const link: HTMLElement = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("includes the copy button", (): void => {
    renderWithProviders(
      <ContactSection email="ada@example.com" links={links} />,
    );
    expect(
      screen.getByRole("button", { name: "Copy email" }),
    ).toBeInTheDocument();
  });

  it("leaves room for the contact form that comes later", (): void => {
    renderWithProviders(
      <ContactSection email="ada@example.com" links={links}>
        <form aria-label="Contact form" />
      </ContactSection>,
    );
    expect(
      screen.getByRole("form", { name: "Contact form" }),
    ).toBeInTheDocument();
  });

  it("translates the section", (): void => {
    renderWithProviders(
      <ContactSection email="ada@example.com" links={links} />,
      { locale: "es" },
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Contacto" }),
    ).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MdxLink } from "@/components/mdx/mdx-link";

vi.mock(
  "@/i18n/navigation",
  async () => import("../../helpers/navigation-mock"),
);

describe("MdxLink", (): void => {
  it("opens external links in a new tab without leaking the opener", (): void => {
    render(<MdxLink href="https://example.com">Example</MdxLink>);
    const link: HTMLElement = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps internal links in the same tab", (): void => {
    render(<MdxLink href="/projects">Projects</MdxLink>);
    const link: HTMLElement = screen.getByRole("link", { name: "Projects" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).not.toHaveAttribute("target");
  });

  it("leaves mailto and anchor links untouched", (): void => {
    render(
      <>
        <MdxLink href="mailto:ada@example.com">Mail</MdxLink>
        <MdxLink href="#contact">Contact</MdxLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Mail" })).not.toHaveAttribute(
      "target",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});

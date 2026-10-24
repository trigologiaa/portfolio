import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/site";
import { renderWithProviders } from "../../render-with-providers";

describe("Footer", (): void => {
  it("shows the copyright with the current year and the site name", (): void => {
    renderWithProviders(<Footer year={2030} />);
    expect(
      screen.getByText(`© 2030 ${siteConfig.name}. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it("renders social links that open in a new tab safely", (): void => {
    renderWithProviders(
      <Footer
        year={2030}
        links={[{ label: "GitHub", href: "https://github.com/someone" }]}
      />,
    );
    const link: HTMLElement = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/someone");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders no social list when there are no links", (): void => {
    renderWithProviders(<Footer year={2030} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

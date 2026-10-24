import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "@/components/layout/skip-link";
import { renderWithProviders } from "../../render-with-providers";

describe("SkipLink", (): void => {
  it("links to the main content", (): void => {
    renderWithProviders(<SkipLink />);
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#content");
  });

  it("is translated", (): void => {
    renderWithProviders(<SkipLink />, { locale: "es" });
    expect(
      screen.getByRole("link", { name: "Saltar al contenido" }),
    ).toBeInTheDocument();
  });
});

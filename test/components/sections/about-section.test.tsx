import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/sections/about-section";
import { renderWithProviders } from "../../render-with-providers";

describe("AboutSection", (): void => {
  it("renders the content under the About heading", (): void => {
    renderWithProviders(
      <AboutSection>
        <p>I like building products.</p>
      </AboutSection>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "About me" }),
    ).toBeInTheDocument();
    expect(screen.getByText("I like building products.")).toBeInTheDocument();
  });

  it("uses the section id that the navigation points to", (): void => {
    const { container } = renderWithProviders(
      <AboutSection>
        <p>Hi</p>
      </AboutSection>,
    );
    expect(container.querySelector("section#about")).not.toBeNull();
  });

  it("translates the heading", (): void => {
    renderWithProviders(
      <AboutSection>
        <p>Hola</p>
      </AboutSection>,
      { locale: "es" },
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Sobre mí" }),
    ).toBeInTheDocument();
  });
});

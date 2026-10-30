import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AboutSection,
  MAX_HIGHLIGHTS,
} from "@/components/sections/about-section";
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

  it("lists the highlights", (): void => {
    renderWithProviders(
      <AboutSection highlights={["Buenos Aires", "Spanish and English"]}>
        <p>Hi</p>
      </AboutSection>,
    );
    const list = screen.getByRole("list", { name: "Quick facts" });
    expect(list).toBeInTheDocument();
    expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    expect(screen.getByText("Spanish and English")).toBeInTheDocument();
  });

  it("shows at most MAX_HIGHLIGHTS highlights", (): void => {
    const six: string[] = ["a", "b", "c", "d", "e", "f"].map(
      (letter) => `fact ${letter}`,
    );
    renderWithProviders(
      <AboutSection highlights={six}>
        <p>Hi</p>
      </AboutSection>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(MAX_HIGHLIGHTS);
    expect(screen.queryByText("fact e")).not.toBeInTheDocument();
  });

  it("renders no list when there are no highlights", (): void => {
    renderWithProviders(
      <AboutSection highlights={[]}>
        <p>Hi</p>
      </AboutSection>,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

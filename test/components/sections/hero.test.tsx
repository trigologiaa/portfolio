import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/sections/hero";
import { renderWithProviders } from "../../render-with-providers";

vi.mock(
  "@/i18n/navigation",
  async () => import("../../helpers/navigation-mock"),
);

const profile = {
  name: "Ada Lovelace",
  headline: "Full-stack developer",
  pitch: "I build things for the web.",
};

describe("Hero", (): void => {
  it("shows the name as the page heading, the headline and the pitch", (): void => {
    renderWithProviders(<Hero profile={profile} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Full-stack developer")).toBeInTheDocument();
    expect(screen.getByText("I build things for the web.")).toBeInTheDocument();
  });

  it("shows the availability note when it exists", (): void => {
    renderWithProviders(
      <Hero profile={{ ...profile, availability: "Open to opportunities" }} />,
    );
    expect(screen.getByText("Open to opportunities")).toBeInTheDocument();
  });

  it("renders no availability note when it does not exist", (): void => {
    renderWithProviders(<Hero profile={profile} />);
    expect(screen.queryByText("Open to opportunities")).not.toBeInTheDocument();
  });
});

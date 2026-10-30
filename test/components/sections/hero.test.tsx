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

  it("links the main calls to action to the projects and contact sections", (): void => {
    renderWithProviders(<Hero profile={profile} />);
    expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("does not show a CV button when no CV is available", (): void => {
    renderWithProviders(<Hero profile={profile} />);
    expect(
      screen.queryByRole("link", { name: "Download CV" }),
    ).not.toBeInTheDocument();
  });

  it("shows the CV button when a CV is available", (): void => {
    renderWithProviders(
      <Hero profile={profile} cv={{ href: "/cv/cv-en.pdf" }} />,
    );
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "href",
      "/cv/cv-en.pdf",
    );
  });

  it("shows the photo with its alternative text when there is one", (): void => {
    renderWithProviders(
      <Hero
        profile={{
          ...profile,
          photo: { src: "/images/profile.jpg", alt: "Portrait of Ada" },
        }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Portrait of Ada" }),
    ).toBeInTheDocument();
  });

  it("renders no image at all when there is no photo", (): void => {
    renderWithProviders(<Hero profile={profile} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("translates the calls to action", (): void => {
    renderWithProviders(
      <Hero profile={profile} cv={{ href: "/cv/cv-es.pdf" }} />,
      {
        locale: "es",
      },
    );
    expect(
      screen.getByRole("link", { name: "Ver proyectos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Contactarme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Descargar CV" }),
    ).toBeInTheDocument();
  });
});

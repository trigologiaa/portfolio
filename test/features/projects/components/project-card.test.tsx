import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectCard } from "@/features/projects/components/project-card";
import type { Project } from "@/features/projects/curation/curate";
import { makeProject } from "../../../helpers/repo-factory";
import { renderWithProviders } from "../../../render-with-providers";

vi.mock(
  "@/i18n/navigation",
  async () => import("../../../helpers/navigation-mock"),
);

const MAX_TECHNOLOGIES: number = 4;
const LANGUAGE_NAMES: string[] = ["TypeScript", "SQL", "Shell", "CSS", "HTML"];
const LANGUAGES: Record<string, number> = Object.fromEntries(
  LANGUAGE_NAMES.map((name: string, index: number): [string, number] => [
    name,
    LANGUAGE_NAMES.length - index,
  ]),
);

describe("ProjectCard", (): void => {
  it("shows the title linked to the detail page, and the summary", (): void => {
    renderWithProviders(<ProjectCard project={makeProject()} />);
    const heading: HTMLElement = screen.getByRole("heading", {
      level: 3,
      name: "shop-api",
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "shop-api" })).toHaveAttribute(
      "href",
      "/projects/shop-api",
    );
    expect(screen.getByText("REST API for an online shop")).toBeInTheDocument();
  });

  it("shows up to four technologies", (): void => {
    const project: Project = makeProject({
      repo: {
        languages: LANGUAGES,
        topics: ["api"],
      },
    });
    renderWithProviders(<ProjectCard project={project} />);
    const tags: HTMLElement = screen.getByRole("list", {
      name: "Technologies",
    });
    expect(tags.querySelectorAll("li")).toHaveLength(MAX_TECHNOLOGIES);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByText("HTML")).not.toBeInTheDocument();
  });

  it("links to the source code and to the live demo with descriptive names", (): void => {
    renderWithProviders(<ProjectCard project={makeProject()} />);
    const code: HTMLElement = screen.getByRole("link", {
      name: "Source code of shop-api",
    });
    const demo: HTMLElement = screen.getByRole("link", {
      name: "Live demo of shop-api",
    });
    expect(code).toHaveAttribute("href", "https://github.com/ada/repo");
    expect(demo).toHaveAttribute("href", "https://shop.example.dev");
    for (const link of [code, demo]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("shows no demo link for a project without one, and keeps the code link", (): void => {
    renderWithProviders(
      <ProjectCard project={makeProject({ repo: { homepage: null } })} />,
    );
    expect(
      screen.queryByRole("link", { name: /Live demo/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Source code/ }),
    ).toBeInTheDocument();
  });

  it("shows when the project was last updated", (): void => {
    renderWithProviders(<ProjectCard project={makeProject()} />);
    expect(screen.getByText("Updated Sep 2026")).toBeInTheDocument();
  });

  it("marks featured projects", (): void => {
    renderWithProviders(
      <ProjectCard project={makeProject({ featured: true })} />,
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not mark the other projects", (): void => {
    renderWithProviders(
      <ProjectCard project={makeProject({ featured: false })} />,
    );
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("shows the first screenshot with its alternative text", (): void => {
    const project: Project = makeProject({
      enrichment: {
        tags: [],
        screenshots: [
          { src: "/projects/shop-api/home.png", alt: "Home page of the shop" },
        ],
        body: "",
      },
    });
    renderWithProviders(<ProjectCard project={project} />);
    expect(
      screen.getByRole("img", { name: "Home page of the shop" }),
    ).toBeInTheDocument();
  });

  it("uses a decorative placeholder instead of an image when there is no screenshot", (): void => {
    renderWithProviders(<ProjectCard project={makeProject()} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("builds a summary when the project has no description", (): void => {
    renderWithProviders(
      <ProjectCard project={makeProject({ repo: { description: null } })} />,
    );
    expect(screen.getByText("TypeScript project")).toBeInTheDocument();
  });

  it("builds a generic summary when there is no description and no language", (): void => {
    const project: Project = makeProject({
      repo: { description: null, language: null, languages: {}, topics: [] },
    });
    renderWithProviders(<ProjectCard project={project} />);
    expect(screen.getByText("Open source project")).toBeInTheDocument();
  });

  it("translates the texts", (): void => {
    renderWithProviders(
      <ProjectCard project={makeProject({ featured: true })} />,
      { locale: "es" },
    );
    expect(screen.getByText("Destacado")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Demo online de shop-api" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Actualizado /)).toBeInTheDocument();
  });
});

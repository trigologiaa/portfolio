import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import type { Project } from "@/features/projects/curation/curate";
import { makeProject } from "../../../helpers/repo-factory";
import { renderWithProviders } from "../../../render-with-providers";

vi.mock(
  "@/i18n/navigation",
  async () => import("../../../helpers/navigation-mock"),
);

const sampleProjects: Project[] = ["a", "b", "c"].map((name) =>
  makeProject({ repo: { name } }),
);

describe("ProjectGrid", (): void => {
  it("renders one card per project inside a list", (): void => {
    renderWithProviders(
      <ProjectGrid projects={sampleProjects} label="Projects" />,
    );
    const list: HTMLElement = screen.getByRole("list", { name: "Projects" });
    expect(within(list).getAllByRole("article")).toHaveLength(
      sampleProjects.length,
    );
  });
});

describe("ProjectsSection", (): void => {
  it("shows the heading, the cards and a link to the full list", (): void => {
    renderWithProviders(<ProjectsSection projects={sampleProjects} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(sampleProjects.length);
    expect(
      screen.getByRole("link", { name: "View all projects" }),
    ).toHaveAttribute("href", "/projects");
  });

  it("uses the section id that the navigation points to", (): void => {
    const { container } = renderWithProviders(
      <ProjectsSection projects={sampleProjects} />,
    );
    expect(container.querySelector("section#projects")).not.toBeNull();
  });

  it("translates the heading and the link", (): void => {
    renderWithProviders(<ProjectsSection projects={sampleProjects} />, {
      locale: "es",
    });
    expect(
      screen.getByRole("heading", { level: 2, name: "Proyectos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ver todos los proyectos" }),
    ).toBeInTheDocument();
  });
});

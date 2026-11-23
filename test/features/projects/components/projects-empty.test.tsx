import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectsEmpty } from "@/features/projects/components/projects-empty";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import { makeProject } from "../../../helpers/repo-factory";
import { renderWithProviders } from "../../../render-with-providers";

vi.mock(
  "@/i18n/navigation",
  async () => import("../../../helpers/navigation-mock"),
);

describe("ProjectsEmpty", (): void => {
  it("explains that projects are coming and links to the GitHub profile", (): void => {
    renderWithProviders(<ProjectsEmpty githubUrl="https://github.com/ada" />);
    expect(screen.getByText("Projects coming soon")).toBeInTheDocument();
    const link: HTMLElement = screen.getByRole("link", {
      name: "See my GitHub profile",
    });
    expect(link).toHaveAttribute("href", "https://github.com/ada");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("translates the messages", (): void => {
    renderWithProviders(<ProjectsEmpty githubUrl="https://github.com/ada" />, {
      locale: "es",
    });
    expect(screen.getByText("Proyectos próximamente")).toBeInTheDocument();
  });
});

describe("ProjectsSection without projects", (): void => {
  it("keeps the section and its heading but shows the empty state instead of the grid", (): void => {
    const { container } = renderWithProviders(
      <ProjectsSection projects={[]} githubUrl="https://github.com/ada" />,
    );
    expect(container.querySelector("section#projects")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Projects coming soon")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "View all projects" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("still shows the grid and the link when there are projects", (): void => {
    renderWithProviders(
      <ProjectsSection
        projects={[makeProject()]}
        githubUrl="https://github.com/ada"
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "View all projects" }),
    ).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import { makeProject } from "../../../helpers/repo-factory";
import { renderWithProviders } from "../../../render-with-providers";

vi.mock(
  "@/i18n/navigation",
  async () => import("../../../helpers/navigation-mock"),
);

describe("ProjectDetail with only GitHub data", (): void => {
  it("shows the title as the page heading, the description and the technologies", (): void => {
    renderWithProviders(
      <ProjectDetail project={makeProject()} previous={null} next={null} />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "shop-api" }),
    ).toBeInTheDocument();
    expect(screen.getByText("REST API for an online shop")).toBeInTheDocument();
    const tech: HTMLElement = screen.getByRole("list", {
      name: "Technologies",
    });
    expect(tech).toHaveTextContent("TypeScript");
    expect(tech).toHaveTextContent("SQL");
  });

  it("links to the code, to the live demo and back to the list", (): void => {
    renderWithProviders(
      <ProjectDetail project={makeProject()} previous={null} next={null} />,
    );
    expect(
      screen.getByRole("link", { name: "Source code of shop-api" }),
    ).toHaveAttribute("href", "https://github.com/ada/repo");
    expect(
      screen.getByRole("link", { name: "Live demo of shop-api" }),
    ).toHaveAttribute("href", "https://shop.example.dev");
    expect(screen.getByRole("link", { name: /All projects/ })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("shows the last update", (): void => {
    renderWithProviders(
      <ProjectDetail project={makeProject()} previous={null} next={null} />,
    );
    expect(screen.getByText("Updated Sep 2026")).toBeInTheDocument();
  });

  it("renders no empty sections", (): void => {
    renderWithProviders(
      <ProjectDetail project={makeProject()} previous={null} next={null} />,
    );
    expect(
      screen.queryByRole("heading", { name: "Screenshots" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "More projects" }),
    ).not.toBeInTheDocument();
  });
});

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

describe("ProjectDetail with extra content", (): void => {
  const enriched = {
    tags: ["postgres"],
    screenshots: [
      {
        src: "/projects/shop-api/home.svg",
        alt: "Overview page",
      },
      {
        src: "/projects/shop-api/orders.svg",
        alt: "Orders page",
      },
    ],
    body: "",
  };

  it("shows the screenshots with their alternative text under a heading", (): void => {
    renderWithProviders(
      <ProjectDetail
        project={makeProject({ enrichment: enriched })}
        previous={null}
        next={null}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Screenshots" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Overview page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Orders page" }),
    ).toBeInTheDocument();
  });

  it("renders the written text that the page passes as children", (): void => {
    renderWithProviders(
      <ProjectDetail project={makeProject()} previous={null} next={null}>
        <p>What I learned building it.</p>
      </ProjectDetail>,
    );
    expect(screen.getByText("What I learned building it.")).toBeInTheDocument();
  });

  it("includes the enrichment tags among the technologies", (): void => {
    renderWithProviders(
      <ProjectDetail
        project={makeProject({ enrichment: enriched })}
        previous={null}
        next={null}
      />,
    );
    expect(
      screen.getByRole("list", { name: "Technologies" }),
    ).toHaveTextContent("postgres");
  });

  it("shows stars and forks only when there are some", (): void => {
    const { unmount } = renderWithProviders(
      <ProjectDetail
        project={makeProject({ repo: { stars: 12, forks: 1 } })}
        previous={null}
        next={null}
      />,
    );
    expect(screen.getByText("12 stars")).toBeInTheDocument();
    expect(screen.getByText("1 fork")).toBeInTheDocument();
    unmount();
    renderWithProviders(
      <ProjectDetail
        project={makeProject({ repo: { stars: 0, forks: 0 } })}
        previous={null}
        next={null}
      />,
    );
    expect(screen.queryByText(/star/)).not.toBeInTheDocument();
    expect(screen.queryByText(/fork/)).not.toBeInTheDocument();
  });
});

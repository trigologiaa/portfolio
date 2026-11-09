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
});

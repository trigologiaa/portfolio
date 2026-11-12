import { screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsExplorer } from "@/features/projects/components/projects-explorer";
import type { Project } from "@/features/projects/curation/curate";
import { makeProject } from "../../../helpers/repo-factory";
import { renderWithProviders } from "../../../render-with-providers";

let replaceState: ReturnType<typeof vi.spyOn>;
let search: string = "";

const projects: Project[] = [
  project("ts-one", "TypeScript"),
  project("ts-two", "TypeScript"),
  project("py-one", "Python"),
  project("go-one", "Go"),
];
const ALL_PROJECTS: number = 4;
const TS_AND_PY_PROJECTS: number = 3;

function project(name: string, language: string): Project {
  return makeProject({
    repo: { name, languages: Object.fromEntries([[language, 1]]), topics: [] },
  });
}

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
}));
vi.mock(
  "@/i18n/navigation",
  async () => import("../../../helpers/navigation-mock"),
);

beforeEach((): void => {
  search = "";
  replaceState = vi
    .spyOn(window.history, "replaceState")
    .mockImplementation(() => {});
});

afterEach((): void => {
  replaceState.mockRestore();
});

describe("ProjectsExplorer", (): void => {
  it("shows every project and one chip per technology, most used first", (): void => {
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    expect(screen.getAllByRole("article")).toHaveLength(ALL_PROJECTS);
    const chips = screen.getByRole("group", { name: "Filter by technology" });
    expect(chips.querySelectorAll("button")[0]).toHaveTextContent("TypeScript");
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("status")).toHaveTextContent("4 projects");
  });

  it("filters by the chosen technology and records it in the url", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    await user.click(screen.getByRole("button", { name: "TypeScript" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "TypeScript" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("2 projects");
    expect(replaceState).toHaveBeenLastCalledWith(
      null,
      "",
      expect.stringContaining("tech=typescript"),
    );
  });

  it("combines technologies with OR", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    await user.click(screen.getByRole("button", { name: "TypeScript" }));
    await user.click(screen.getByRole("button", { name: "Python" }));
    expect(screen.getAllByRole("article")).toHaveLength(TS_AND_PY_PROJECTS);
  });

  it("restores the filter from the url on load", (): void => {
    search = "tech=python";
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("ignores an unknown value in the url and shows every project", (): void => {
    search = "tech=does-not-exist";
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    expect(screen.getAllByRole("article")).toHaveLength(ALL_PROJECTS);
    expect(
      screen.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
  });

  it("clears the filters and the url parameter", async (): Promise<void> => {
    search = "tech=python";
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getAllByRole("article")).toHaveLength(ALL_PROJECTS);
    expect(replaceState).toHaveBeenLastCalledWith(
      null,
      "",
      expect.not.stringContaining("tech="),
    );
  });

  it("uses the singular form for a single project", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<ProjectsExplorer projects={projects} />);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 project");
  });

  it("translates the controls", (): void => {
    renderWithProviders(<ProjectsExplorer projects={projects} />, {
      locale: "es",
    });
    expect(
      screen.getByRole("group", { name: "Filtrar por tecnología" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("4 proyectos");
  });
});

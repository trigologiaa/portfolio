import { screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TimelineSection } from "@/components/sections/timeline-section";
import type { TimelineEntry } from "@/lib/content";
import { renderWithProviders } from "../../render-with-providers";

function entry(
  overrides: Partial<TimelineEntry> & { id: string },
): TimelineEntry {
  return {
    type: "education",
    title: `Title ${overrides.id}`,
    organization: `Org ${overrides.id}`,
    start: "2020-01",
    description: `Description ${overrides.id}`,
    ...overrides,
  };
}

describe("TimelineSection", (): void => {
  it("lists the entries newest first inside an ordered list", (): void => {
    renderWithProviders(
      <TimelineSection
        entries={[
          entry({ id: "old", start: "2018-03", end: "2020-12" }),
          entry({ id: "new", start: "2023-09" }),
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Experience & education" }),
    ).toBeInTheDocument();
    const items: HTMLElement[] = within(
      screen.getByRole("list", { name: "Experience & education" }),
    ).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    const [newest, oldest]: (HTMLElement | undefined)[] = items;
    if (!newest || !oldest) {
      throw new Error("Expected two list items");
    }
    expect(within(newest).getByRole("heading", { level: 3 })).toHaveTextContent(
      "Title new",
    );
    expect(within(oldest).getByRole("heading", { level: 3 })).toHaveTextContent(
      "Title old",
    );
  });

  it("shows the organization, the description and the period", (): void => {
    renderWithProviders(
      <TimelineSection entries={[entry({ id: "a", start: "2023-02" })]} />,
    );
    expect(screen.getByText("Org a")).toBeInTheDocument();
    expect(screen.getByText("Description a")).toBeInTheDocument();
    expect(screen.getByText("Feb 2023 - Present")).toBeInTheDocument();
  });

  it("shows the ongoing label in Spanish", (): void => {
    renderWithProviders(
      <TimelineSection entries={[entry({ id: "a", start: "2023-02" })]} />,
      {
        locale: "es",
      },
    );
    expect(screen.getByText(/Actualidad$/)).toBeInTheDocument();
  });

  it("filters by type with the chips", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(
      <TimelineSection
        entries={[
          entry({ id: "school", type: "education" }),
          entry({ id: "job", type: "work", start: "2022-01" }),
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Work" }));
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Title job")).toBeInTheDocument();
    expect(screen.queryByText("Title school")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Title school")).toBeInTheDocument();
  });

  it("does not offer a Work chip when there are no work entries", (): void => {
    renderWithProviders(
      <TimelineSection
        entries={[
          entry({ id: "a", type: "education" }),
          entry({ id: "b", type: "course" }),
        ]}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Education" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Courses" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Work" }),
    ).not.toBeInTheDocument();
  });

  it("shows no filter at all when there is a single type, and no error either", (): void => {
    renderWithProviders(
      <TimelineSection entries={[entry({ id: "a", type: "education" })]} />,
    );
    expect(
      screen.queryByRole("group", { name: "Filter by type" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Title a")).toBeInTheDocument();
  });
});

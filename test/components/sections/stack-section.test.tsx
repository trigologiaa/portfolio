import { screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StackSection } from "@/components/sections/stack-section";
import type { Stack } from "@/lib/content/schemas";
import { renderWithProviders } from "../../render-with-providers";

const stack: Stack = {
  categories: [
    {
      id: "frontend",
      name: "Frontend",
      items: [
        { id: "react", name: "React", icon: "react" },
        { id: "typescript", name: "TypeScript", icon: "typescript" },
      ],
    },
    {
      id: "backend",
      name: "Backend",
      items: [{ id: "nodejs", name: "Node.js", icon: "nodejs" }],
    },
    {
      id: "tools",
      name: "Tools",
      items: [{ id: "git", name: "Git", icon: "git" }],
    },
  ],
};

describe("StackSection", (): void => {
  it("shows a tab for each category and the items of the first one", (): void => {
    renderWithProviders(<StackSection stack={stack} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Stack" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(stack.categories.length);
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByText("TypeScript")).toBeVisible();
  });

  it("moves between tabs with the arrow keys and shows the matching panel", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<StackSection stack={stack} />);
    const frontendTab: HTMLElement = screen.getByRole("tab", {
      name: "Frontend",
    });
    const backendTab: HTMLElement = screen.getByRole("tab", {
      name: "Backend",
    });
    frontendTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(backendTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Node.js")).toBeVisible();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("does not show levels, percentages or years of experience", (): void => {
    const { container } = renderWithProviders(<StackSection stack={stack} />);
    expect(container.textContent).not.toMatch(/%|years|años/i);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("translates the heading", (): void => {
    renderWithProviders(<StackSection stack={stack} />, { locale: "es" });
    expect(
      screen.getByRole("heading", { level: 2, name: "Stack" }),
    ).toBeInTheDocument();
  });
});

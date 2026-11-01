import { screen } from "@testing-library/react";
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

describe("StackSection", () => {
  it("shows a tab for each category and the items of the first one", () => {
    renderWithProviders(<StackSection stack={stack} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Stack" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(stack.categories.length);
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByText("TypeScript")).toBeVisible();
  });
});

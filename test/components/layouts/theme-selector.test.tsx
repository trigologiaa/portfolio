import { type RenderResult, render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";

const labels = {
  group: "Theme",
  options: {
    latte: "Latte (light)",
    frappe: "Frappé (dark)",
    macchiato: "Macchiato (darker)",
    mocha: "Mocha (darkest)",
  },
};

function renderSelector(): RenderResult {
  return render(
    <ThemeProvider>
      <ThemeSelector labels={labels} />
    </ThemeProvider>,
  );
}

describe("ThemeSelector", (): void => {
  it("has a button with an accessible name, closed at first", (): void => {
    renderSelector();
    expect(screen.getByRole("button", { name: /Theme/ })).toBeInTheDocument();
    expect(screen.queryByRole("menuitemradio")).not.toBeInTheDocument();
  });

  it("lists the four flavors with their darkness when opened", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderSelector();
    await user.click(screen.getByRole("button", { name: /Theme/ }));
    for (const label of Object.values(labels.options)) {
      expect(
        screen.getByRole("menuitemradio", { name: label }),
      ).toBeInTheDocument();
    }
  });
});

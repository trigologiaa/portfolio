import { type RenderResult, render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";
import type { Flavor } from "@/lib/theme";

interface ThemeLabels {
  group: string;
  options: Record<Flavor, string>;
}

const labels: ThemeLabels = {
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

  it("applies the chosen flavor and stores it", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderSelector();
    await user.click(screen.getByRole("button", { name: /Theme/ }));
    await user.click(
      screen.getByRole("menuitemradio", { name: "Frappé (dark)" }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "frappe");
    expect(localStorage.getItem("theme")).toBe("frappe");
  });

  it("marks the stored flavor as the active one", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    localStorage.setItem("theme", "macchiato");
    renderSelector();
    await user.click(screen.getByRole("button", { name: /Theme/ }));
    expect(
      screen.getByRole("menuitemradio", { name: "Macchiato (darker)" }),
    ).toBeChecked();
    expect(
      screen.getByRole("menuitemradio", { name: "Latte (light)" }),
    ).not.toBeChecked();
  });

  it("falls back to the system flavor when the stored value is invalid", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    localStorage.setItem("theme", "banana");
    renderSelector();
    await user.click(
      await screen.findByRole("button", { name: "Theme: Latte (light)" }),
    );
    expect(
      screen.getByRole("menuitemradio", { name: "Latte (light)" }),
    ).toBeChecked();
  });
});

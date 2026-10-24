import test, { type ConsoleMessage, expect } from "@playwright/test";

const selector: { name: RegExp } = {
  name: /^Theme/,
};

const FLAVOR_LABELS: readonly string[] = [
  "Latte (light)",
  "Frappé (dark)",
  "Macchiato (darker)",
  "Mocha (darkest)",
] as const;

test("a dark system starts in Mocha", async ({ page }): Promise<void> => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "mocha");
});

test("a light system starts in Latte", async ({ page }): Promise<void> => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "latte");
});

test("the selector lists the four flavors with their darkness", async ({
  page,
}): Promise<void> => {
  await page.goto("/");
  await page.getByRole("button", selector).click();
  for (const name of FLAVOR_LABELS) {
    await expect(page.getByRole("menuitemradio", { name })).toBeVisible();
  }
});

test("a manual choice overrides the system and persists after a reload", async ({
  page,
}): Promise<void> => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", selector).click();
  await page.getByRole("menuitemradio", { name: "Latte (light)" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "latte");
  expect(
    await page.evaluate<string | null>((): string | null =>
      localStorage.getItem("theme"),
    ),
  ).toBe("latte");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "latte");
});

test("an invalid stored value falls back to the system theme without errors", async ({
  page,
}): Promise<void> => {
  const errors: string[] = [];
  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  await page.addInitScript(() => localStorage.setItem("theme", "banana"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "mocha");
  expect(errors).toEqual([]);
});

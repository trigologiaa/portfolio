import { expect, type Locator, test } from "@playwright/test";

const FEATURED_COUNT: number = 6;

test("the home shows only the featured projects and a link to the full list", async ({
  page,
}): Promise<void> => {
  await page.goto("/en#projects");
  const section: Locator = page.locator("#projects");
  await expect(section.getByRole("article")).toHaveCount(FEATURED_COUNT);
  await expect(
    section.getByRole("link", { name: "View all projects" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "shop-api" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "dotfiles" }),
  ).toHaveCount(0);
});

test("the full list shows every curated project and hides forks, archived and the portfolio", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects");
  await expect(
    page.getByRole("heading", { level: 1, name: "All projects" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(10);
  for (const hidden of ["forked-lib", "legacy-site", "portfolio"]) {
    await expect(
      page.getByRole("heading", { level: 3, name: hidden, exact: true }),
    ).toHaveCount(0);
  }
});

test("a card shows the essentials of a project", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects");
  const card: Locator = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "shop-api" }) });
  await expect(
    card.getByText(
      "REST API for an online shop with authentication and payments",
    ),
  ).toBeVisible();
  await expect(
    card.getByRole("list", { name: "Technologies" }).getByText("TypeScript"),
  ).toBeVisible();
  await expect(
    card.getByRole("link", { name: "Live demo of shop-api" }),
  ).toHaveAttribute("href", "https://shop-api.example.dev");
  await expect(
    card.getByRole("link", { name: "Source code of shop-api" }),
  ).toHaveAttribute("href", "https://github.com/ada/shop-api");
});

test("a project without a demo has no demo link, and one without a description has a fallback", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects");
  const chat: Locator = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "chat-app" }) });
  await expect(chat.getByRole("link", { name: /Live demo/ })).toHaveCount(0);
  await expect(chat.getByRole("link", { name: /Source code/ })).toBeVisible();
  const dotfiles: Locator = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "dotfiles" }) });
  await expect(dotfiles.getByText("Shell project")).toBeVisible();
});

test("the list is translated", async ({ page }): Promise<void> => {
  await page.goto("/es/projects");
  await expect(
    page.getByRole("heading", { level: 1, name: "Todos los proyectos" }),
  ).toBeVisible();
});

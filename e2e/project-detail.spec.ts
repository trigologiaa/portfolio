import test, { expect } from "@playwright/test";

test("a project with extra content shows the screenshots and the written text", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects/shop-api");
  await expect(
    page.getByRole("heading", { level: 1, name: "shop-api" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Overview of the shop API documentation page",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "What it does" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Source code of shop-api" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Live demo of shop-api" }),
  ).toBeVisible();
});

test("the same project in Spanish uses the Spanish text", async ({
  page,
}): Promise<void> => {
  await page.goto("/es/projects/shop-api");
  await expect(
    page.getByRole("heading", { level: 2, name: "Qué hace" }),
  ).toBeVisible();
});

test("a project with only GitHub data has no empty sections", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects/chat-app");
  await expect(
    page.getByRole("heading", { level: 1, name: "chat-app" }),
  ).toBeVisible();
  await expect(page.getByText("Realtime chat using WebSockets")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Source code of chat-app" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Screenshots" })).toHaveCount(
    0,
  );
  await expect(page.getByRole("link", { name: /Live demo/ })).toHaveCount(0);
});

for (const slug of [
  "forked-lib",
  "legacy-site",
  "portfolio",
  "does-not-exist",
]) {
  test(`${slug} is not a project page: it shows a localized not-found page`, async ({
    page,
  }) => {
    await page.goto(`/es/projects/${slug}`);
    await expect(
      page.getByRole("heading", { name: "Página no encontrada" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
}

test("the previous and next links walk through the projects", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects");
  const firstSlug = await page
    .getByRole("article")
    .first()
    .getByRole("link")
    .first()
    .getAttribute("href");
  expect(firstSlug).toMatch(/\/projects\//);
  if (!firstSlug) {
    throw new Error("The first project card has no link");
  }
  await page.goto(firstSlug);
  const nextLink = page
    .getByRole("navigation", { name: "More projects" })
    .getByRole("link", {
      name: /Next project/,
    });
  await nextLink.click();
  await expect(page).toHaveURL(/\/en\/projects\/.+/);
  await expect(
    page.getByRole("link", { name: /Previous project/ }),
  ).toBeVisible();
});

test("switching language on a project page keeps the project", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects/shop-api");
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es\/projects\/shop-api$/);
});

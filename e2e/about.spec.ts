import test, { expect } from "@playwright/test";

test("the about section shows the bio in each language", async ({
  page,
}): Promise<void> => {
  await page.goto("/en#about");
  await expect(
    page.getByRole("heading", { level: 2, name: "About me" }),
  ).toBeVisible();
  await expect(page.locator("#about p").first()).toBeVisible();
  await page.goto("/es#about");
  await expect(
    page.getByRole("heading", { level: 2, name: "Sobre mí" }),
  ).toBeVisible();
  await expect(page.locator("#about p").first()).toBeVisible();
});

test("the highlights from the profile are shown", async ({
  page,
}): Promise<void> => {
  await page.goto("/en");
  await expect(
    page
      .getByRole("list", { name: "Quick facts" })
      .getByRole("listitem")
      .first(),
  ).toBeVisible();
});

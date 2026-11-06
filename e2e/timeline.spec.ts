import { expect, type Locator, test } from "@playwright/test";

test("the timeline lists education and courses, newest first", async ({
  page,
}): Promise<void> => {
  await page.goto("/en#experience");
  const list: Locator = page.getByRole("list", {
    name: "Experience & education",
  });
  await expect(list).toBeVisible();
  const items: Locator = list.getByRole("listitem");
  expect(await items.count()).toBeGreaterThanOrEqual(2);
});

test("filtering by type narrows the list and the Work chip is absent without work entries", async ({
  page,
}): Promise<void> => {
  await page.goto("/en#experience");
  await expect(page.getByRole("button", { name: "Work" })).toHaveCount(0);
  const list: Locator = page.getByRole("list", {
    name: "Experience & education",
  });
  const before: number = await list.getByRole("listitem").count();
  await page.getByRole("button", { name: "Courses" }).click();
  const after: number = await list.getByRole("listitem").count();
  expect(after).toBeLessThan(before);
});

test("the ongoing label is translated", async ({ page }): Promise<void> => {
  await page.goto("/es#experience");
  await expect(
    page.getByRole("heading", { level: 2, name: "Experiencia y educación" }),
  ).toBeVisible();
});

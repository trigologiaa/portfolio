import test, { expect } from "@playwright/test";

const TYPESCRIPT_PROJECTS: number = 5;
const TYPESCRIPT_AND_PYTHON_PROJECTS: number = 7;

test("filtering by one technology narrows the list and updates the url", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects");
  await expect(page.getByRole("article")).toHaveCount(10);
  await page.getByRole("button", { name: "TypeScript", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(TYPESCRIPT_PROJECTS);
  await expect(page.getByRole("status")).toHaveText("5 projects");
  await expect(page).toHaveURL(/tech=typescript/);
});

test("several technologies combine with OR", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects");
  await page.getByRole("button", { name: "TypeScript", exact: true }).click();
  await page.getByRole("button", { name: "Python", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(
    TYPESCRIPT_AND_PYTHON_PROJECTS,
  );
});

test("the filter is restored from the url and survives a reload", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects?tech=python");
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "Python", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("article")).toHaveCount(2);
});

test("an unknown technology in the url is ignored", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects?tech=does-not-exist");
  await expect(page.getByRole("article")).toHaveCount(10);
});

test("clearing the filters shows everything again", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/projects?tech=python");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("article")).toHaveCount(10);
  await expect(page).not.toHaveURL(/tech=/);
});

test.describe("without JavaScript", (): void => {
  test.use({ javaScriptEnabled: false });

  test("the full list is still visible", async ({ page }): Promise<void> => {
    await page.goto("/en/projects");
    await expect(page.getByRole("article")).toHaveCount(10);
  });
});

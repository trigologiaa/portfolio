import test, { expect } from "@playwright/test";
import profileEn from "../content/en/profile.json";
import profileEs from "../content/es/profile.json";

test("the hero is shown in the language of the page", async ({
  page,
}): Promise<void> => {
  await page.goto("/es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    profileEs.name,
  );
  await expect(page.getByText(profileEs.headline)).toBeVisible();
});

test('"View projects" scrolls to the projects section', async ({
  page,
}): Promise<void> => {
  await page.goto("/en");
  await page.getByRole("link", { name: "View projects" }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("there is exactly one h1", async ({ page }): Promise<void> => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

test("no CV button or photo appears while neither exists", async ({
  page,
}): Promise<void> => {
  await page.goto("/en");
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: profileEn.name }).getByRole("img"),
  ).toHaveCount(0);
});

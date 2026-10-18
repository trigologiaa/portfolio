import { expect, test } from "@playwright/test";
import { formatPageTitle, siteConfig } from "@/lib/site";

test("home shows the owner's name and the site metadata", async ({
  page,
}): Promise<void> => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    siteConfig.name,
  );
  await expect(page).toHaveTitle(formatPageTitle());
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    siteConfig.description,
  );
});

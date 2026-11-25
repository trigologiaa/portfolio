import test, { expect, type Locator } from "@playwright/test";
import profile from "../content/en/profile.json";

test("the email is a mailto link", async ({ page }): Promise<void> => {
  await page.goto("/en#contact");
  await expect(page.getByRole("link", { name: profile.email })).toHaveAttribute(
    "href",
    `mailto:${profile.email}`,
  );
});

test.describe("copying the email", (): void => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("puts the address in the clipboard and announces it", async ({
    page,
  }): Promise<void> => {
    await page.goto("/en#contact");
    await page.getByRole("button", { name: "Copy email" }).click();
    await expect(page.locator("#contact").getByRole("status")).toHaveText(
      "Copied",
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      profile.email,
    );
  });
});

test.describe("without JavaScript", (): void => {
  test.use({ javaScriptEnabled: false });

  test("the mailto link is still there", async ({ page }): Promise<void> => {
    await page.goto("/en");
    await expect(page.getByRole("link", { name: profile.email })).toBeVisible();
  });
});

test("the footer has the social links on every page", async ({
  page,
}): Promise<void> => {
  for (const url of ["/en", "/en/projects", "/es/projects/shop-api"]) {
    await page.goto(url);
    const footer: Locator = page.getByRole("contentinfo");
    for (const label of ["GitHub", "LinkedIn"]) {
      const link: Locator = footer.getByRole("link", { name: label });
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  }
});

test("the contact section is translated", async ({ page }): Promise<void> => {
  await page.goto("/es#contact");
  await expect(
    page.getByRole("heading", { level: 2, name: "Contacto" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copiar email" }),
  ).toBeVisible();
});

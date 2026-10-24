import { expect, type Locator, test } from "@playwright/test";

test.describe("desktop (1280 px)", (): void => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("header navigation scrolls to a section", async ({
    page,
  }): Promise<void> => {
    await page.goto("/en");
    await page.getByRole("banner").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("the current section is marked with aria-current", async ({
    page,
  }): Promise<void> => {
    await page.goto("/en#stack");
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Stack" }),
    ).toHaveAttribute("aria-current", "location");
  });
});

test.describe("mobile (375 px)", (): void => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("the menu opens, closes with Escape and returns focus", async ({
    page,
  }): Promise<void> => {
    await page.goto("/en");
    const button: Locator = page.getByRole("button", { name: "Open menu" });
    await button.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("there is no horizontal scroll", async ({ page }): Promise<void> => {
    await page.goto("/en");
    const overflow: number = await page.evaluate(
      (): number =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test("the skip link is the first focusable element and moves focus to the content", async ({
  page,
}): Promise<void> => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip: Locator = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
});

test("navigating from an inner page goes back to the home section", async ({
  page,
}): Promise<void> => {
  await page.goto("/en/some-unknown-page");
  await page.getByRole("banner").getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/en#contact$/);
});

import { expect, test } from "@playwright/test";

test("the stack section lists the technology by category", async ({
  page,
}): Promise<void> => {
  await page.goto("/en#stack");
  await expect(
    page.getByRole("heading", { level: 2, name: "Stack" }),
  ).toBeVisible();
  const tabs = page.getByRole("tab");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Backend" }).click();
  await expect(page.getByRole("tabpanel").getByText("Node.js")).toBeVisible();
});

test("the tabs work on a small screen without horizontal scroll", async ({
  page,
}): Promise<void> => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/en#stack");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

import { expect, test } from "@playwright/test";

const HTTP_TEMPORARY_REDIRECT = 307;
const HTTP_PERMANENT_REDIRECT = 308;
const HTTP_NOT_FOUND = 404;

test.describe("browser in Spanish (Argentina)", (): void => {
  test.use({ locale: "es-AR" });

  test("redirects / to /es and sets the document language", async ({
    page,
  }): Promise<void> => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByText("Bienvenido a mi portfolio")).toBeVisible();
  });
});

test.describe("browser in an unsupported language", (): void => {
  test.use({ locale: "fr-FR" });

  test("falls back to English", async ({ page }): Promise<void> => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});

test("the root redirect takes a single hop", async ({
  request,
}): Promise<void> => {
  const response = await request.get("/", {
    headers: {
      "accept-language": "es-AR,es;q=0.9",
    },
    maxRedirects: 0,
  });
  expect([HTTP_TEMPORARY_REDIRECT, HTTP_PERMANENT_REDIRECT]).toContain(
    response.status(),
  );
  expect(response.headers().location).toMatch(/\/es$/);
});

test("switching language changes the page and stores the choice in a cookie", async ({
  page,
  context,
}): Promise<void> => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.getByText("Bienvenido a mi portfolio")).toBeVisible();
  const cookies = await context.cookies();
  expect(cookies.find((cookie) => cookie.name === "NEXT_LOCALE")?.value).toBe(
    "es",
  );
});

test("an unknown locale ends in a 404", async ({ request }): Promise<void> => {
  const response = await request.get("/fr");
  expect(response.status()).toBe(HTTP_NOT_FOUND);
});

test("an unknown page inside a locale shows the localized 404", async ({
  page,
}): Promise<void> => {
  const response = await page.goto("/es/esta-pagina-no-existe");
  expect(response?.status()).toBe(HTTP_NOT_FOUND);
  await expect(
    page.getByRole("heading", { name: "Página no encontrada" }),
  ).toBeVisible();
});

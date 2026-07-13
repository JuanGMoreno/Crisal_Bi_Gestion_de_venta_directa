import { expect, Page } from "@playwright/test";

export const E2E_EMAIL = process.env.E2E_EMAIL;
export const E2E_PASSWORD = process.env.E2E_PASSWORD;
export const hasE2ECredentials = Boolean(E2E_EMAIL && E2E_PASSWORD);

export async function mockLoggedOutSession(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "No existe una sesion activa." }),
    });
  });
}

export async function signIn(page: Page) {
  if (!E2E_EMAIL || !E2E_PASSWORD) {
    throw new Error("Define E2E_EMAIL y E2E_PASSWORD para ejecutar flujos autenticados.");
  }

  await page.goto("/auth/signin");
  await page.getByLabel(/Correo/i).fill(E2E_EMAIL);
  await page.getByLabel(/Contrase/i).fill(E2E_PASSWORD);
  await page.getByRole("button", { name: /Iniciar Sesi/i }).click();

  await expect(page).toHaveURL(/\/system$/);
  await expect(page.getByRole("heading", { name: "Hola de nuevo" })).toBeVisible();
}

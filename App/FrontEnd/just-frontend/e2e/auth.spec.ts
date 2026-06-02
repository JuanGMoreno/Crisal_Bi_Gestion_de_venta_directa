import { expect, test } from "@playwright/test";
import { hasE2ECredentials, mockLoggedOutSession, signIn } from "./helpers/auth";

test("@public renderiza el formulario de inicio de sesion", async ({ page }) => {
  await mockLoggedOutSession(page);
  await page.goto("/auth/signin");

  await expect(page.getByLabel(/Correo/i)).toBeVisible();
  await expect(page.getByLabel(/Contrase/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Iniciar Sesi/i })).toBeVisible();
});

test("@public redirige una ruta protegida al inicio de sesion", async ({ page }) => {
  await mockLoggedOutSession(page);
  await page.goto("/system/products");

  await expect(page).toHaveURL(/\/auth\/signin$/);
  await expect(page.getByRole("button", { name: /Iniciar Sesi/i })).toBeVisible();
});

test("inicia sesion y carga el sistema protegido", async ({ page }) => {
  test.skip(!hasE2ECredentials, "Define E2E_EMAIL y E2E_PASSWORD para probar login real.");

  await signIn(page);
});

import { expect, test } from "@playwright/test";
import { hasE2ECredentials, mockLoggedOutSession, signIn } from "./helpers/auth";

test("@public renderiza el formulario de inicio de sesion", async ({ page }) => {
  await mockLoggedOutSession(page);
  await page.goto("/auth/signin");

  await expect(page.getByLabel(/Correo/i)).toBeVisible();
  await expect(page.getByLabel(/Contrase/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Iniciar Sesi/i })).toBeVisible();
});

test("@public comunica el arranque del servicio mientras comprueba la sesion", async ({ page }) => {
  await page.route("**/api/auth/me", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "No existe una sesion activa." }),
    });
  });

  await page.goto("/auth/signin");

  const loadingStatus = page.getByRole("status", {
    name: "Cargando la sesión de Crisal",
  });
  await expect(loadingStatus).toContainText("Estamos preparando Crisal");
  await expect(loadingStatus).toContainText("El primer acceso puede tardar unos segundos");
  await expect(page.getByLabel(/Correo/i)).toBeVisible();
});

test("@public no vuelve a comprobar la sesion al recuperar el foco", async ({ page }) => {
  let sessionRequests = 0;
  await page.clock.install();
  await page.route("**/api/auth/me", async (route) => {
    sessionRequests += 1;
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "No existe una sesion activa." }),
    });
  });

  await page.goto("/auth/signin");
  await expect(page.getByLabel(/Correo/i)).toBeVisible();
  await page.clock.fastForward(5 * 60 * 1000 + 1);
  await page.evaluate(() => {
    window.dispatchEvent(new Event("focus"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(200);

  expect(sessionRequests).toBe(1);
});

test("@public inicia sesion sin una segunda consulta de validacion", async ({ page }) => {
  let sessionRequests = 0;
  await page.route("**/api/auth/me", async (route) => {
    sessionRequests += 1;
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "No existe una sesion activa." }),
    });
  });
  await page.route("**/api/auth/signin", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Login correcto",
        user: { id: "user-e2e", email: "demo@crisal.test" },
      }),
    });
  });
  await page.route("**/api/distributors/me", async (route) => {
    const now = new Date().toISOString();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id_distribuidor: "distributor-e2e",
        id_usuario: "user-e2e",
        nombre: "Negocio de prueba",
        foto_avatar: null,
        estado: "Activo",
        createdAt: now,
        updatedAt: now,
        usuario: {
          id_usuario: "user-e2e",
          correo: "demo@crisal.test",
          estado: "Activo",
          createdAt: now,
          updatedAt: now,
        },
      }),
    });
  });

  await page.goto("/auth/signin");
  await page.getByLabel(/Correo/i).fill("demo@crisal.test");
  await page.getByLabel(/Contrase/i).fill("Contrasena123");
  await page.getByRole("button", { name: /Iniciar Sesi/i }).click();

  await expect(page).toHaveURL(/\/system$/);
  expect(sessionRequests).toBe(1);
  await expect(page.getByRole("heading", { name: "Controla tu operacion comercial" })).toBeVisible();
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

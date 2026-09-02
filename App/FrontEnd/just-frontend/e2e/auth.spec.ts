import { expect, test, type Page } from "@playwright/test";
import { hasE2ECredentials, mockLoggedOutSession, signIn } from "./helpers/auth";

async function mockAuthenticatedSession(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Sesion activa",
        user: { id: "user-e2e", email: "demo@crisal.test" },
      }),
    });
  });
}

async function mockProfile(page: Page, name = "Negocio de prueba") {
  await page.route("**/api/distributors/me", async (route) => {
    const now = new Date().toISOString();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id_distribuidor: "distributor-e2e",
        id_usuario: "user-e2e",
        nombre: name,
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
}

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
  await mockProfile(page);

  await page.goto("/auth/signin");
  await page.getByLabel(/Correo/i).fill("demo@crisal.test");
  await page.getByLabel(/Contrase/i).fill("Contrasena123");
  await page.getByRole("button", { name: /Iniciar Sesi/i }).click();

  await expect(page).toHaveURL(/\/system$/);
  expect(sessionRequests).toBe(1);
  await expect(page.getByRole("heading", { name: "Controla tu operacion comercial" })).toBeVisible();
});

test("@public espera al backend y cierra la sesion sin reactivarla", async ({ page }) => {
  let sessionRequests = 0;
  let signoutCompleted = false;

  await page.route("**/api/auth/me", async (route) => {
    sessionRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Sesion activa",
        user: { id: "user-e2e", email: "demo@crisal.test" },
      }),
    });
  });
  await page.route("**/api/auth/signout", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    signoutCompleted = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Sesion cerrada" }),
    });
  });
  await mockProfile(page);

  await page.goto("/system/profile");
  await expect(page.getByRole("heading", { name: "Negocio de prueba" })).toBeVisible();

  await page.getByRole("button", { name: "Cerrar sesión" }).click();

  const signingOutButton = page.getByRole("button", { name: "Cerrando sesión..." });
  await expect(signingOutButton).toBeDisabled();
  expect(signoutCompleted).toBe(false);
  await expect(page).toHaveURL(/\/auth\/signin$/);
  expect(signoutCompleted).toBe(true);
  expect(sessionRequests).toBe(1);
});

test("@public conserva y trunca nombres largos en la barra lateral", async ({ page }) => {
  const longProfileName = "Distribuidora La Esperanza del Valle y Productos Naturales";
  await mockAuthenticatedSession(page);
  await mockProfile(page, longProfileName);

  await page.goto("/system/profile");

  const profileLink = page.getByRole("link", {
    name: `Abrir perfil de ${longProfileName}`,
  });
  const sidebar = page.locator('[data-sidebar="sidebar"]').filter({ visible: true });
  const profileName = profileLink.locator("p").first();
  await expect(sidebar).toBeInViewport();
  await expect(profileLink).toBeVisible();
  await expect(profileName).toHaveText(longProfileName);
  await expect(profileName).toHaveAttribute("title", longProfileName);

  const textStyles = await profileName.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      overflow: styles.overflow,
      textOverflow: styles.textOverflow,
      whiteSpace: styles.whiteSpace,
    };
  });
  expect(textStyles).toEqual({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });

  const brandLogo = page
    .getByRole("link", { name: "Crisal: ir al inicio" })
    .locator("img");
  const logoSize = await brandLogo.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  });
  expect(logoSize).toEqual({ width: 32, height: 32 });

  await page.getByRole("button", { name: "Toggle Sidebar" }).click();
  await expect(sidebar).not.toBeInViewport();
});

test("@public mantiene el perfil dentro de la barra lateral movil", async ({ page }) => {
  const longProfileName = "Distribuidora La Esperanza del Valle y Productos Naturales";
  await page.setViewportSize({ width: 390, height: 844 });
  await mockAuthenticatedSession(page);
  await mockProfile(page, longProfileName);

  await page.goto("/system/profile");
  await page.getByRole("button", { name: "Toggle Sidebar" }).click();

  const sidebar = page.locator('[data-sidebar="sidebar"]').filter({ visible: true });
  const profileLink = page.getByRole("link", {
    name: `Abrir perfil de ${longProfileName}`,
  });
  await expect(profileLink).toBeVisible();

  const dimensions = await sidebar.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
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

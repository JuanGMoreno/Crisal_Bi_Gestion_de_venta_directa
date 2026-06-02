import { expect, test } from "@playwright/test";
import { hasE2ECredentials, signIn } from "./helpers/auth";
import { createProduct } from "./helpers/products";

test.describe("productos autenticados", () => {
  test.skip(!hasE2ECredentials, "Define E2E_EMAIL y E2E_PASSWORD para probar productos.");

  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("abre el modulo sin aceptar redireccion a login como resultado valido", async ({ page }) => {
    await page.goto("/system/products");

    await expect(page).toHaveURL(/\/system\/products$/);
    await expect(page.getByRole("button", { name: "Agregar Producto" }).first()).toBeVisible();
  });

  test("crea un producto desde el modal", async ({ page }) => {
    const product = await createProduct(page);

    await expect(page).toHaveURL(/\/system\/products$/);
    await expect(page.getByText(product.name)).toBeVisible();
  });
});

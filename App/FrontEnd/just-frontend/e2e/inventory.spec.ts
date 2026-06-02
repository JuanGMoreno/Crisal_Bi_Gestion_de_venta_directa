import { expect, test } from "@playwright/test";
import { hasE2ECredentials, signIn } from "./helpers/auth";
import { createProduct } from "./helpers/products";

test.describe("inventario autenticado", () => {
  test.skip(!hasE2ECredentials, "Define E2E_EMAIL y E2E_PASSWORD para probar inventario.");

  test("registra un ingreso para un producto nuevo", async ({ page }) => {
    await signIn(page);
    const product = await createProduct(page);

    await page.goto("/system/inventory/create");
    await expect(page).toHaveURL(/\/system\/inventory\/create$/);
    await page.getByRole("combobox").click();
    await page.getByText(product.name, { exact: true }).click();
    await page.locator("#quantity-0").fill("5");
    await page.locator("#cost-0").fill("7500");
    await page.locator("#lot-0").fill(`LOTE-${product.code}`);
    await page.locator('button[type="submit"][form="form-inventory-entry"]').click();

    await expect(page.getByText("Ingreso registrado correctamente")).toBeVisible();
    await expect(page).toHaveURL(/\/system\/inventory$/);
  });
});

import { expect, Page } from "@playwright/test";

export function createUniqueProductData() {
  const uniqueCode = String(Date.now()).slice(-4);

  return {
    code: uniqueCode,
    name: `Producto E2E ${uniqueCode}`,
  };
}

export async function createProduct(page: Page) {
  const product = createUniqueProductData();

  await page.goto("/system/products");
  await expect(page).toHaveURL(/\/system\/products$/);
  await page.getByRole("button", { name: "Agregar Producto" }).first().click();
  await page.locator("#name").fill(product.name);
  await page.locator("#code").fill(product.code);
  await page.locator("#baseSalePrice").fill("15900");
  await page.locator("#description").fill(`Producto creado por Playwright con codigo ${product.code}`);
  await page.locator('button[type="submit"][form="form-product"]').click();

  await expect(page.getByText("Producto creado correctamente")).toBeVisible();

  return product;
}

import { expect, test } from '@playwright/test';
import { hasE2ECredentials, signIn } from './helpers/auth';
import { createClosedSaleFixture } from './helpers/api';

test.describe('ventas autenticadas', () => {
  test.skip(!hasE2ECredentials, 'Define E2E_EMAIL y E2E_PASSWORD para probar ventas.');

  test('muestra una venta cerrada creada para el negocio autenticado', async ({ page }) => {
    await signIn(page);
    const fixture = await createClosedSaleFixture(page.request);

    try {
      await page.goto('/system/sales');
      await expect(page.getByText(fixture.clientName)).toBeVisible();
      await expect(page.getByText('Cerrada').first()).toBeVisible();
    } finally {
      await fixture.cancel();
    }
  });
});

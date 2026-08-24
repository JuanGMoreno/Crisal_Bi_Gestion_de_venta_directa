import { expect, test } from '@playwright/test';
import { hasE2ECredentials, signIn } from './helpers/auth';

test.describe('clientes autenticados', () => {
  test.skip(!hasE2ECredentials, 'Define E2E_EMAIL y E2E_PASSWORD para probar clientes.');

  test('registra un cliente desde la interfaz', async ({ page }) => {
    await signIn(page);
    const suffix = Date.now().toString(36);
    const clientName = `Cliente E2E ${suffix}`;

    await page.goto('/system/clients');
    await page.getByRole('button', { name: 'Registrar cliente' }).first().click();
    await page.locator('#client-name').fill(clientName);
    await page.locator('#client-document').fill(`DOC-${suffix}`);
    await page.getByRole('button', { name: 'Guardar cliente' }).click();

    await expect(page.getByText('Cliente creado correctamente')).toBeVisible();
    await expect(page.getByText(clientName)).toBeVisible();
  });
});

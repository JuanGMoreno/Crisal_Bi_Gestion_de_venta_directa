import { expect, test } from '@playwright/test';
import { hasE2ECredentials, signIn } from './helpers/auth';

test.describe('perfil autenticado', () => {
  test.skip(!hasE2ECredentials, 'Define E2E_EMAIL y E2E_PASSWORD para probar el perfil.');

  test('actualiza el nombre visible del negocio', async ({ page }) => {
    await signIn(page);
    const businessName = `Negocio E2E ${Date.now().toString(36)}`;

    await page.goto('/system/profile');
    await page.getByRole('button', { name: 'Editar perfil' }).click();
    await page.locator('#profile-name').fill(businessName);
    await page.getByRole('button', { name: 'Guardar cambios' }).click();

    await expect(page.getByText('Perfil actualizado correctamente')).toBeVisible();
    await expect(page.getByRole('heading', { name: businessName })).toBeVisible();
  });
});

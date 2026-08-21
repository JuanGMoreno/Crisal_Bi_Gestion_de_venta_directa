import { authSignupSchema } from './authSignupSchema';

describe('authSignupSchema', () => {
  test('crea cuentas sin roles ni datos jerarquicos', () => {
    const result = authSignupSchema.parse({
      nombre: 'Tienda Ana',
      correo: 'ana@example.com',
      contraseña: 'secreto123',
      confirmarContrasena: 'secreto123',
    });

    expect(result).not.toHaveProperty('rol');
    expect(result).not.toHaveProperty('id_distribuidor_padre');
  });
});

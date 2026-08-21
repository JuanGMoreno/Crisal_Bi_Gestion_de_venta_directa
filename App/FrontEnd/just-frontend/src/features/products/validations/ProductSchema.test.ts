import { ProductSchema } from './ProductSchema';

const baseProduct = {
  nombre: 'Bolso artesanal',
  descripcion: 'Producto elaborado a mano',
  codigo: 'B001',
  precio_base_venta: 25000,
  estado: 'Activo' as const,
};

describe('ProductSchema', () => {
  test('acepta productos sin categoria', () => {
    expect(ProductSchema.safeParse(baseProduct).success).toBe(true);
  });

  test('acepta una categoria personalizada', () => {
    const result = ProductSchema.parse({
      ...baseProduct,
      categoria: 'Accesorios artesanales',
    });

    expect(result.categoria).toBe('Accesorios artesanales');
  });

  test('rechaza categorias de mas de 80 caracteres', () => {
    const result = ProductSchema.safeParse({
      ...baseProduct,
      categoria: 'a'.repeat(81),
    });

    expect(result.success).toBe(false);
  });
});

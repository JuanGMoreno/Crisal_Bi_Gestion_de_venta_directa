interface Product {
    id_producto: string ,
    nombre: string,
    descripcion?: string | null,
    codigo : string,
    precio_base_venta: number,
    foto_avatar?: string | null,
    estado: string,
    categoria: string
}

export default Product;
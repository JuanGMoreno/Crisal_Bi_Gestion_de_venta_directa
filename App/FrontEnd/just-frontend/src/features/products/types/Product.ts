interface Product {
    id_producto: string ,
    nombre: string,
    descripcion: string,
    codigo : string,
    precio_compra: number,
    precio_venta: number,
    foto_avatar: string,
    estado: string
}

export interface  ItemProductTable {
    nombre: string,
    codigo : string,
    precio_compra: number,
    precio_venta: number,
    estado: string
}

export default Product;
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  marca: string;
  tallas: string[];
  imagen: string;
  descuento?: number;
  imagen_original?: string;
  activo?: boolean;
} 
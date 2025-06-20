import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Nike Air Max 270',
      descripcion: 'Zapatillas deportivas con máxima amortiguación y estilo moderno.',
      precio: 129.99,
      imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      stock: 15
    },
    {
      id: 2,
      nombre: 'Adidas Ultraboost 22',
      descripcion: 'Corre con comodidad y rendimiento con la última tecnología Boost.',
      precio: 179.99,
      imagen: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
      stock: 8
    },
    {
      id: 3,
      nombre: 'Under Armour Tech 2.0',
      descripcion: 'Camiseta deportiva transpirable y ligera para entrenamientos intensos.',
      precio: 89.99,
      imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      stock: 25
    },
    {
      id: 4,
      nombre: 'Nike Dri-FIT Training',
      descripcion: 'Pantalón deportivo con tecnología Dri-FIT para mantenerte seco.',
      precio: 64.99,
      imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      stock: 12
    },
    {
      id: 5,
      nombre: 'Adidas Tiro 21',
      descripcion: 'Pantalón de entrenamiento clásico, ideal para cualquier deporte.',
      precio: 79.99,
      imagen: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      stock: 18
    },
    {
      id: 6,
      nombre: 'Puma RS-X',
      descripcion: 'Zapatillas urbanas con diseño retro y máxima comodidad.',
      precio: 109.99,
      imagen: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
      stock: 10
    }
  ];

  cantidades: { [id: number]: number } = {};

  constructor(public carritoService: CarritoService) {}

  agregarAlCarrito(producto: Producto) {
    const cantidad = this.cantidades[producto.id] && this.cantidades[producto.id] > 0 ? this.cantidades[producto.id] : 1;
    this.carritoService.agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: cantidad,
      stock: producto.stock
    });
    alert('Producto agregado al carrito: ' + producto.nombre + ' x' + cantidad);
    this.cantidades[producto.id] = 1;
  }
} 
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>(this.obtenerCarritoLocal());
  carrito$ = this.carritoSubject.asObservable();

  private obtenerCarritoLocal(): ProductoCarrito[] {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  private guardarCarritoLocal(carrito: ProductoCarrito[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  obtenerCarrito(): ProductoCarrito[] {
    return this.carritoSubject.value;
  }

  agregarProducto(producto: ProductoCarrito) {
    let carrito = this.obtenerCarrito();
    const idx = carrito.findIndex(p => p.id === producto.id);
    if (idx > -1) {
      carrito[idx].cantidad += producto.cantidad;
    } else {
      carrito.push(producto);
    }
    this.carritoSubject.next([...carrito]);
    this.guardarCarritoLocal(carrito);
  }

  limpiarCarrito() {
    this.carritoSubject.next([]);
    this.guardarCarritoLocal([]);
  }

  eliminarProducto(id: number) {
    let carrito = this.obtenerCarrito().filter(p => p.id !== id);
    this.carritoSubject.next(carrito);
    this.guardarCarritoLocal(carrito);
  }

  restarUnidad(id: number) {
    let carrito = this.obtenerCarrito();
    const idx = carrito.findIndex(p => p.id === id);
    if (idx > -1) {
      if (carrito[idx].cantidad > 1) {
        carrito[idx].cantidad -= 1;
      } else {
        carrito = carrito.filter(p => p.id !== id);
      }
      this.carritoSubject.next([...carrito]);
      this.guardarCarritoLocal(carrito);
    }
  }
} 
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

export interface ProductoCarrito extends Producto {
  cantidad: number;
}

export interface EstadoCarrito {
  items: ProductoCarrito[];
  cantidadTotal: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>(this.obtenerCarritoLocal());
  
  public estadoCarrito$: Observable<EstadoCarrito> = this.carritoSubject.asObservable().pipe(
    map(items => {
      const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);
      const subtotal = items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
      return { items, cantidadTotal, subtotal };
    })
  );

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
      const cantidadPotencial = carrito[idx].cantidad + producto.cantidad;
      carrito[idx].cantidad = Math.min(cantidadPotencial, carrito[idx].stock);
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
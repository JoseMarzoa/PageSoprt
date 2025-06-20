import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() producto!: Producto;
  @Output() productAdded = new EventEmitter<Producto>();

  cantidad = 1;

  constructor(private carritoService: CarritoService) {}

  agregarAlCarrito(event: Event): void {
    event.stopPropagation();
    this.carritoService.agregarProducto({ ...this.producto, cantidad: this.cantidad });
    console.log(`${this.cantidad} x ${this.producto.nombre} agregado(s) al carrito.`);
    this.cantidad = 1;
  }

  incrementarCantidad(event: Event): void {
    event.stopPropagation();
    if (this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  decrementarCantidad(event: Event): void {
    event.stopPropagation();
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
} 
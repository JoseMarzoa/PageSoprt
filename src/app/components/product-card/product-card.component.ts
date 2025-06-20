import { Component, Input } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descuento?: number;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() producto!: Producto;

  addToCart() {
    console.log('Producto agregado al carrito:', this.producto.nombre);
  }

  addToWishlist() {
    console.log('Producto agregado a favoritos:', this.producto.nombre);
  }
} 
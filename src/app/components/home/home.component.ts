import { Component, OnInit } from '@angular/core';
import { Producto } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  productosDestacados: Producto[] = [];
  masVendidos: Producto[] = [];

  constructor() { }

  ngOnInit(): void {
    // Aquí deberías cargar tus productos desde un servicio
    this.productosDestacados = [
      { id: 1, nombre: 'Camiseta Deportiva', categoria: 'Ropa', precio: 25.00, imagen: 'assets/images/product-1.jpg' },
      { id: 2, nombre: 'Zapatillas de Correr', categoria: 'Calzado', precio: 80.00, imagen: 'assets/images/product-2.jpg', descuento: 15 },
      { id: 3, nombre: 'Pantalones Cortos', categoria: 'Ropa', precio: 30.00, imagen: 'assets/images/product-3.jpg' },
      { id: 4, nombre: 'Sudadera con Capucha', categoria: 'Ropa', precio: 50.00, imagen: 'assets/images/product-4.jpg' }
    ];

    this.masVendidos = [
      { id: 5, nombre: 'Leggings de Yoga', categoria: 'Ropa', precio: 45.00, imagen: 'assets/images/product-5.jpg' },
      { id: 6, nombre: 'Gorra Deportiva', categoria: 'Accesorios', precio: 15.00, imagen: 'assets/images/product-6.jpg' },
      { id: 2, nombre: 'Zapatillas de Correr', categoria: 'Calzado', precio: 80.00, imagen: 'assets/images/product-2.jpg', descuento: 15 },
    ];
  }
} 
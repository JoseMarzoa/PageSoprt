import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';

type SortOrder = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  
  showFilters = false;
  
  // Filtros
  categoriasUnicas: string[] = [];
  marcasUnicas: string[] = [];
  tallasUnicas: string[] = [];
  
  categoriasSeleccionadas: string[] = [];
  marcasSeleccionadas: string[] = [];
  tallasSeleccionadas: string[] = [];
  
  precioMaximo = 500;
  maxPrice = 500;
  orden: SortOrder = 'relevancia';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:4001/api/productos').subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data;

      // Extraer valores únicos para filtros
      this.categoriasUnicas = [...new Set(data.map(p => p.categoria))];
      this.marcasUnicas = [...new Set(data.map(p => p.marca))];
      this.tallasUnicas = [...new Set(data.flatMap(p => p.tallas))].sort();
      
      const max = Math.max(...data.map(p => p.precio));
      this.maxPrice = max > 0 ? max : 500;
      this.precioMaximo = this.maxPrice;
      this.aplicarFiltros();
    });
  }

  toggleFilters(): void { this.showFilters = !this.showFilters; }

  // --- MANEJO DE CAMBIOS EN FILTROS ---

  onCategoryChange(event: Event): void {
    this.handleCheckboxChange(event, this.categoriasSeleccionadas);
  }

  onBrandChange(event: Event): void {
    this.handleCheckboxChange(event, this.marcasSeleccionadas);
  }

  onSizeChange(talla: string): void {
    const index = this.tallasSeleccionadas.indexOf(talla);
    if (index > -1) {
      this.tallasSeleccionadas.splice(index, 1);
    } else {
      this.tallasSeleccionadas.push(talla);
    }
    this.aplicarFiltros();
  }

  private handleCheckboxChange(event: Event, selectionArray: string[]): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      selectionArray.push(input.value);
    } else {
      const index = selectionArray.indexOf(input.value);
      if (index > -1) selectionArray.splice(index, 1);
    }
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.categoriasSeleccionadas = [];
    this.marcasSeleccionadas = [];
    this.tallasSeleccionadas = [];
    this.precioMaximo = this.maxPrice;
    this.orden = 'relevancia';
    this.aplicarFiltros();
  }

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---

  aplicarFiltros(): void {
    let filtrados = [...this.productos];

    // Filtrado
    if (this.categoriasSeleccionadas.length > 0) {
      filtrados = filtrados.filter(p => this.categoriasSeleccionadas.includes(p.categoria));
    }
    if (this.marcasSeleccionadas.length > 0) {
      filtrados = filtrados.filter(p => this.marcasSeleccionadas.includes(p.marca));
    }
    if (this.tallasSeleccionadas.length > 0) {
      filtrados = filtrados.filter(p => p.tallas.some(t => this.tallasSeleccionadas.includes(t)));
    }
    filtrados = filtrados.filter(p => p.precio <= this.precioMaximo);

    // Ordenación
    switch (this.orden) {
      case 'precio-asc':
        filtrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }
    
    this.productosFiltrados = filtrados;
  }
  
  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto({ ...producto, cantidad: 1 });
    console.log(`${producto.nombre} agregado al carrito.`);
  }
} 
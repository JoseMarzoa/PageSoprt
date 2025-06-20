import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  productosDestacados: Producto[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Producto[]>('http://localhost:4001/api/productos').pipe(
      map(productos => this.obtenerAleatorios(productos, 4))
    ).subscribe(productos => {
      this.productosDestacados = productos;
    });
  }

  private obtenerAleatorios(array: any[], n: number): any[] {
    return array.sort(() => 0.5 - Math.random()).slice(0, n);
  }
} 
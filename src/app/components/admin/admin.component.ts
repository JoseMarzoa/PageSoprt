import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../../models/producto.model';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  celular: string;
  rol: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Estados de la aplicación
  currentSection: 'dashboard' | 'usuarios' | 'productos' = 'dashboard';
  
  // Datos
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  productos: Producto[] = [];
  
  // Estados de carga
  loading = false;
  showModal = false;
  modalType: 'create' | 'edit' | 'delete' = 'create';
  selectedItem: any = null;
  
  // Formularios
  usuarioForm!: FormGroup;
  productoForm!: FormGroup;
  
  // Estadísticas
  stats = {
    totalUsuarios: 0,
    totalProductos: 0,
    usuariosNuevos: 0
  };

  imagenPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  categorias: string[] = ['Calzado', 'Ropa', 'Accesorios', 'Equipamiento'];
  nuevaCategoria: string = '';

  private API_URL = 'http://localhost:4001/api';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  private initForms() {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      rol: ['Comprador', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });

    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      imagen: [''],
      stock: ['', [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  // Navegación
  setSection(section: 'dashboard' | 'usuarios' | 'productos') {
    this.currentSection = section;
    if (section !== 'dashboard') {
      this.loadSectionData();
    }
  }

  // Carga de datos
  loadDashboardData() {
    this.loading = true;
    forkJoin({
      usuarios: this.http.get<Usuario[]>(`${this.API_URL}/usuarios`).pipe(catchError(() => of([]))),
      productos: this.http.get<Producto[]>(`${this.API_URL}/productos`).pipe(catchError(() => of([])))
    }).subscribe(({ usuarios, productos }) => {
      this.usuarios = usuarios;
      this.productos = productos;
      this.usuariosFiltrados = usuarios;
      
      this.stats = {
        totalUsuarios: usuarios.length,
        totalProductos: productos.length,
        usuariosNuevos: 0 
      };
      this.loading = false;
    }, error => {
      console.error('Error cargando datos del dashboard:', error);
      this.loading = false;
    });
  }

  loadSectionData() {
    this.loading = true;
    if (this.currentSection === 'usuarios') {
      this.http.get<Usuario[]>(`${this.API_URL}/usuarios`).subscribe(data => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.loading = false;
      });
    } else if (this.currentSection === 'productos') {
      this.http.get<Producto[]>(`${this.API_URL}/productos`).subscribe(data => {
        this.productos = data;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  filtrarUsuarios(event: Event) {
    const termino = (event.target as HTMLInputElement).value.toLowerCase();
    if (!termino) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(u => 
      u.nombre.toLowerCase().includes(termino) ||
      u.apellido.toLowerCase().includes(termino) ||
      u.email.toLowerCase().includes(termino)
    );
  }

  openProductoModal(type: 'create' | 'edit' | 'delete', producto?: Producto) {
    this.modalType = type;
    this.selectedItem = producto;
    
    if (type === 'edit' && producto) {
      this.productoForm.patchValue({
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        stock: producto.stock,
        activo: producto.activo
      });
    } else {
      this.productoForm.reset({ activo: true });
    }
    
    this.showModal = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagenPreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProducto() {
    if (this.productoForm.invalid) {
      return;
    }

    const productoData: Producto = this.productoForm.value;
    
    const saveObservable = this.modalType === 'create'
      ? this.http.post(`${this.API_URL}/productos`, productoData)
      : this.http.put(`${this.API_URL}/productos/${this.selectedItem.id}`, productoData);

    saveObservable.subscribe(() => {
      this.closeModal();
      this.loadSectionData();
    });
  }

  deleteProducto(producto: Producto) {
    if (confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      this.productos = this.productos.filter(p => p.id !== producto.id);
    }
  }

  toggleProductoActivo(producto: Producto) {
    producto.activo = !producto.activo;
  }

  // Utilidades
  closeModal() {
    this.showModal = false;
    this.productoForm.reset({ activo: true });
    this.imagenPreview = null;
    this.selectedFile = null;
  }

  getEstadoColor(estado: boolean): string {
    return estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  agregarCategoria() {
    const cat = this.nuevaCategoria.trim();
    if (cat && !this.categorias.includes(cat)) {
      this.categorias.push(cat);
      this.nuevaCategoria = '';
    }
  }
}
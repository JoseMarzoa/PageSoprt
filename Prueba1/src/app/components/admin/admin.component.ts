import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  celular: string;
  rol: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion: string;
  imagen: string;
  stock: number;
  activo: boolean;
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
    this.loadSectionData();
  }

  // Carga de datos
  loadDashboardData() {
    this.loading = true;
    // Cargar usuarios y productos antes de calcular stats
    this.loadUsuarios();
    this.loadProductos();
    setTimeout(() => {
      this.stats = {
        totalUsuarios: this.usuarios.length,
        totalProductos: this.productos.length,
        usuariosNuevos: 0
      };
      this.loading = false;
    }, 100);
  }

  loadSectionData() {
    this.loading = true;
    setTimeout(() => {
      switch (this.currentSection) {
        case 'usuarios':
          this.loadUsuarios();
          break;
        case 'productos':
          this.loadProductos();
          break;
      }
      this.loading = false;
    }, 500);
  }

  // CRUD Usuarios
  loadUsuarios() {
    // Simular datos de usuarios
    this.usuarios = [
      { id: 1, nombre: 'Jose', apellido: 'Marzoa', username: 'jmarzoa', email: 'marzoajose3@gmail.com', celular: '+59812345678', rol: 'Comprador' },
      { id: 2, nombre: 'Admin', apellido: 'SportFlex', username: 'admin', email: 'admin@sportflex.com', celular: '+59892984881', rol: 'Administrador' }
    ];
  }

  openUsuarioModal(type: 'create' | 'edit', usuario?: Usuario) {
    this.modalType = type;
    this.selectedItem = usuario;
    
    if (type === 'edit' && usuario) {
      this.usuarioForm.patchValue({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        username: usuario.username,
        email: usuario.email,
        celular: usuario.celular,
        rol: usuario.rol,
        password: ''
      });
      // Deshabilitar todos los campos excepto rol
      this.usuarioForm.get('nombre')?.disable();
      this.usuarioForm.get('apellido')?.disable();
      this.usuarioForm.get('username')?.disable();
      this.usuarioForm.get('email')?.disable();
      this.usuarioForm.get('celular')?.disable();
      this.usuarioForm.get('password')?.disable();
      this.usuarioForm.get('rol')?.enable();
    } else {
      this.usuarioForm.reset({ rol: 'Comprador' });
      this.usuarioForm.enable();
    }
    
    this.showModal = true;
  }

  saveUsuario() {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.value;
      
      if (this.modalType === 'create') {
        // Crear nuevo usuario
        const newUsuario = {
          id: this.usuarios.length + 1,
          ...formData
        };
        this.usuarios.push(newUsuario);
      } else {
        // Editar usuario existente
        const index = this.usuarios.findIndex(u => u.id === this.selectedItem.id);
        if (index !== -1) {
          this.usuarios[index] = { ...this.selectedItem, ...formData };
        }
      }
      
      this.closeModal();
    }
  }

  deleteUsuario(usuario: Usuario) {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
    }
  }

  // CRUD Productos
  loadProductos() {
    // Simular datos de productos
    this.productos = [
      { id: 1, nombre: 'Nike Air Max 270', precio: 129.99, categoria: 'Calzado', descripcion: 'Zapatillas deportivas de alta calidad', imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', stock: 15, activo: true },
      { id: 2, nombre: 'Adidas Ultraboost 22', precio: 179.99, categoria: 'Calzado', descripcion: 'Zapatillas para running profesionales', imagen: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop', stock: 8, activo: true },
      { id: 3, nombre: 'Under Armour Tech 2.0', precio: 89.99, categoria: 'Ropa', descripcion: 'Camiseta deportiva de alto rendimiento', imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', stock: 25, activo: true }
    ];
  }

  openProductoModal(type: 'create' | 'edit', producto?: Producto) {
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

  async saveProducto() {
    if (this.productoForm.valid) {
      let imagenUrl = this.productoForm.value.imagen;
      if (this.selectedFile) {
        const formDataImg = new FormData();
        formDataImg.append('imagen', this.selectedFile);
        const uploadResp: any = await this.http.post('/api/productos/upload', formDataImg).toPromise();
        imagenUrl = uploadResp.imageUrl;
      }
      const formData = { ...this.productoForm.value, imagen: imagenUrl };
      if (this.modalType === 'create') {
        await this.http.post('/api/productos', formData).toPromise();
      } else {
        // Lógica de edición si aplica
      }
      this.closeModal();
      this.loadProductos();
      this.selectedFile = null;
      this.imagenPreview = null;
    }
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
    this.selectedItem = null;
    this.usuarioForm.reset({ rol: 'Comprador' });
    this.productoForm.reset({ activo: true });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En proceso': return 'bg-blue-100 text-blue-800';
      case 'Enviado': return 'bg-purple-100 text-purple-800';
      case 'Entregado': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRolColor(rol: string): string {
    return rol === 'Administrador' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  }

  agregarCategoria() {
    const cat = this.nuevaCategoria.trim();
    if (cat && !this.categorias.includes(cat)) {
      this.categorias.push(cat);
      this.nuevaCategoria = '';
    }
  }
}
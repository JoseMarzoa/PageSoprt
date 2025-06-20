import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../services/auth.service';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  showUserMenu = false;
  showRegisterModal = false;
  showEditProfile = false;
  showCarrito = false;

  usuario: Usuario | null = null;
  cantidadCarrito = 0;
  productosCarrito: ProductoCarrito[] = [];

  get totalCarrito(): number {
    return this.productosCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }
  
  constructor(
    public authService: AuthService,
    public carritoService: CarritoService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });

    this.carritoService.carrito$.subscribe(productos => {
      this.productosCarrito = productos;
      this.cantidadCarrito = productos.reduce((total, p) => total + p.cantidad, 0);
    });
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  toggleUserMenu() { this.showUserMenu = !this.showUserMenu; }
  
  openRegisterModal() { this.showRegisterModal = true; this.closeMenu(); }
  closeRegisterModal() { this.showRegisterModal = false; }
  
  openEditProfile() { this.showEditProfile = true; this.showUserMenu = false; }
  closeEditProfile() { this.showEditProfile = false; }
  
  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }

  abrirCarrito() { this.showCarrito = true; }
  cerrarCarrito() { this.showCarrito = false; }

  sumarUnidad(producto: ProductoCarrito) {
    this.carritoService.agregarProducto(producto);
  }

  restarUnidad(productoId: number) {
    this.carritoService.restarUnidad(productoId);
  }

  eliminarProducto(productoId: number) {
    this.carritoService.eliminarProducto(productoId);
  }

  comprarPorWhatsApp() {
    if (this.productosCarrito.length === 0) {
      return;
    }

    // Número de WhatsApp de la empresa (puedes cambiarlo por el número real)
    const numeroWhatsApp = '59892984881'; // Formato: código país + número sin espacios
    
    // Crear el mensaje con los productos
    let mensaje = 'Hola estoy interesado/a en hacer esta compra:\n\n';
    
    // Agregar cada producto al mensaje
    this.productosCarrito.forEach((producto, index) => {
      mensaje += `${index + 1}. ${producto.nombre}\n`;
      mensaje += `   Cantidad: ${producto.cantidad}\n`;
      mensaje += `   Precio unitario: $${producto.precio}\n`;
      mensaje += `   Stock disponible: ${producto.stock}\n`;
      mensaje += `   Subtotal: $${producto.precio * producto.cantidad}\n\n`;
    });
    
    // Agregar el total
    mensaje += `💰 Total de la compra: $${this.totalCarrito.toFixed(2)}\n\n`;
    mensaje += 'Por favor, confírmame la disponibilidad y las opciones de pago. ¡Gracias!';
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear la URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(urlWhatsApp, '_blank');
    
    // Cerrar el carrito después de enviar
    this.cerrarCarrito();
  }
} 
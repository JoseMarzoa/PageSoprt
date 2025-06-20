import { Component } from '@angular/core';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  showRegisterModal = false;
  showCarrito = false;
  showUserMenu = false;
  showEditProfile = false;
  cantidadCarrito = 0;
  productosCarrito: ProductoCarrito[] = [];
  usuario: Usuario | null = null;

  constructor(
    public carritoService: CarritoService,
    public authService: AuthService
  ) {
    this.carritoService.carrito$.subscribe(carrito => {
      this.productosCarrito = carrito;
      this.cantidadCarrito = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    });

    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  openEditProfile() {
    this.showEditProfile = true;
    this.showUserMenu = false;
  }

  closeEditProfile() {
    this.showEditProfile = false;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }

  abrirCarrito() {
    this.showCarrito = true;
  }

  cerrarCarrito() {
    this.showCarrito = false;
  }

  get totalCarrito(): number {
    return this.productosCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  sumarUnidad(prod: ProductoCarrito) {
    this.carritoService.agregarProducto({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: prod.imagen,
      cantidad: 1,
      stock: prod.stock
    });
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
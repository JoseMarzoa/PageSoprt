import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../services/auth.service';
import { CarritoService, EstadoCarrito } from '../../services/carrito.service';
import { UiService } from '../../services/ui.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

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

  usuario$: Observable<Usuario | null>;
  estadoCarrito$: Observable<EstadoCarrito>;

  constructor(
    public authService: AuthService,
    private carritoService: CarritoService,
    private uiService: UiService
  ) {
    this.usuario$ = this.authService.usuario$;
    this.estadoCarrito$ = this.carritoService.estadoCarrito$;
  }

  ngOnInit(): void {}

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

  toggleCart() {
    this.uiService.toggleCart();
  }
} 
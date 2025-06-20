import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent {
  @Output() close = new EventEmitter<void>();

  modo: 'registro' | 'ingreso' = 'registro';

  // Registro
  nombre: string = '';
  apellido: string = '';
  username: string = '';
  email: string = '';
  celular: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Ingreso
  emailLogin: string = '';
  passwordLogin: string = '';

  // Visibilidad de contraseñas
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showPasswordLogin: boolean = false;

  mensaje: string = '';
  error: string = '';

  private API_URL = 'http://localhost:4001/api/usuarios';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  alternarModo() {
    this.modo = this.modo === 'registro' ? 'ingreso' : 'registro';
    this.limpiarMensajes();
  }

  limpiarMensajes() {
    this.mensaje = '';
    this.error = '';
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword' | 'passwordLogin') {
    switch (field) {
      case 'password':
        this.showPassword = !this.showPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
      case 'passwordLogin':
        this.showPasswordLogin = !this.showPasswordLogin;
        break;
    }
  }

  registrarUsuario() {
    this.limpiarMensajes();
    if (!this.nombre || !this.apellido || !this.username || !this.email || !this.celular || !this.password || !this.confirmPassword) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }
    if (!/^[0-9]{9}$/.test(this.celular)) {
      this.error = 'El celular debe tener exactamente 9 dígitos numéricos.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    // Enviar el celular en texto claro
    this.http.post<any>(`${this.API_URL}/register`, {
      nombre: this.nombre,
      apellido: this.apellido,
      username: this.username,
      email: this.email,
      celular: this.celular,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.mensaje = '¡Registro exitoso! Ya puedes iniciar sesión.';
        this.modo = 'ingreso';
        this.nombre = this.apellido = this.username = this.email = this.celular = this.password = this.confirmPassword = '';
        this.cerrar();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al registrar usuario.';
      }
    });
  }

  ingresarUsuario() {
    this.limpiarMensajes();
    if (!this.emailLogin || !this.passwordLogin) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }
    
    this.authService.login(this.emailLogin, this.passwordLogin).subscribe({
      next: (res) => {
        this.authService.setUsuario(res.user);
        this.mensaje = '¡Ingreso exitoso!';
        this.emailLogin = this.passwordLogin = '';
        setTimeout(() => {
          this.cerrar();
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.error || 'Email o contraseña incorrectos.';
      }
    });
  }

  cerrar() {
    this.close.emit();
  }
} 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  celular: string;
  rol: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUsuarioLocal());
  usuario$ = this.usuarioSubject.asObservable();
  private API_URL = 'http://localhost:4000/api/usuarios';

  constructor(private http: HttpClient) {}

  private getUsuarioLocal(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  private guardarUsuarioLocal(usuario: Usuario | null) {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  estaLogueado(): boolean {
    return this.getUsuario() !== null;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password });
  }

  logout() {
    this.usuarioSubject.next(null);
    this.guardarUsuarioLocal(null);
  }

  actualizarPerfil(datosActualizados: Partial<Usuario>) {
    const usuarioActual = this.getUsuario();
    if (!usuarioActual) return;

    return this.http.put<any>(`${this.API_URL}/update`, {
      id: usuarioActual.id,
      ...datosActualizados
    });
  }

  setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
    this.guardarUsuarioLocal(usuario);
  }
} 
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();

  profileForm: FormGroup;
  usuario: Usuario | null = null;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
      if (this.usuario) {
        this.profileForm.patchValue(this.usuario);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  saveChanges(): void {
    if (this.profileForm.invalid || this.isSaving || !this.usuario) {
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { nombre, apellido, username, email, celular, password } = this.profileForm.value;
    const updatePayload: Partial<Usuario> = {
      id: this.usuario!.id,
      nombre, apellido, username, email, celular
    };

    if (password) {
      updatePayload.password = password;
    }

    this.authService.actualizarPerfil(updatePayload)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: (res) => {
          this.authService.setUsuario(res.user);
          this.successMessage = '¡Perfil actualizado con éxito!';
          setTimeout(() => this.close(), 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Hubo un error al actualizar el perfil.';
        }
      });
  }

  close(): void {
    this.onClose.emit();
  }
} 
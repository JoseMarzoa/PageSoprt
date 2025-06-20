import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Usuario {
  id: number;
  username: string;
  email: string;
  rol: string;
  fechaRegistro?: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  usuario: Usuario | null = null;
  editForm: FormGroup;
  isEditing = false;
  isSaving = false;
  showPassword = false;
  showConfirmPassword = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      this.usuario = JSON.parse(userData);
      this.editForm.patchValue({
        username: this.usuario?.username || '',
        email: this.usuario?.email || ''
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  startEditing() {
    this.isEditing = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserData(); // Reset form to original values
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  saveChanges() {
    if (this.editForm.valid && !this.isSaving) {
      this.isSaving = true;
      this.showSuccessMessage = false;
      this.showErrorMessage = false;

      const formData = this.editForm.value;
      
      // Simular actualización
      setTimeout(() => {
        if (this.usuario) {
          // Actualizar datos del usuario
          this.usuario.username = formData.username;
          this.usuario.email = formData.email;
          
          // Guardar en localStorage
          localStorage.setItem('usuario', JSON.stringify(this.usuario));
          
          this.isEditing = false;
          this.isSaving = false;
          this.showSuccessMessage = true;
          
          // Ocultar mensaje de éxito después de 3 segundos
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        }
      }, 1000);
    } else {
      this.showErrorMessage = true;
      this.errorMessage = 'Por favor, corrige los errores en el formulario';
      this.isSaving = false;
    }
  }
} 
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    newsletter: false
  };

  isSubmitting = false;

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simular envío del formulario
    setTimeout(() => {
      console.log('Formulario enviado:', this.formData);
      
      // Mostrar mensaje de éxito
      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      
      // Resetear formulario
      this.formData = {
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
        newsletter: false
      };
      
      this.isSubmitting = false;
    }, 2000);
  }
} 
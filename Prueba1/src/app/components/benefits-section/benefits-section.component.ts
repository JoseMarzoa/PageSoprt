import { Component } from '@angular/core';

interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-benefits-section',
  templateUrl: './benefits-section.component.html',
  styleUrls: ['./benefits-section.component.css']
})
export class BenefitsSectionComponent {
  benefits: Benefit[] = [
    {
      id: 1,
      icon: 'fas fa-shipping-fast',
      title: 'Envío Gratis',
      description: 'Envío gratis en pedidos superiores a $50. Entrega en 24-48 horas.',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      icon: 'fas fa-shield-alt',
      title: 'Garantía de Calidad',
      description: 'Todos nuestros productos cuentan con garantía de 30 días.',
      color: 'bg-green-500'
    },
    {
      id: 3,
      icon: 'fas fa-undo',
      title: 'Devolución Fácil',
      description: 'Devoluciones gratuitas hasta 30 días después de la compra.',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      icon: 'fas fa-headset',
      title: 'Soporte 24/7',
      description: 'Atención al cliente disponible las 24 horas del día.',
      color: 'bg-orange-500'
    },
    {
      id: 5,
      icon: 'fas fa-medal',
      title: 'Productos Originales',
      description: 'Solo vendemos productos 100% originales de las mejores marcas.',
      color: 'bg-red-500'
    },
    {
      id: 6,
      icon: 'fas fa-gift',
      title: 'Programa de Fidelidad',
      description: 'Gana puntos con cada compra y obtén descuentos exclusivos.',
      color: 'bg-pink-500'
    }
  ];
} 
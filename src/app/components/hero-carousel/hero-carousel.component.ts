import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides = [
    {
      image: 'assets/images/hero-1.jpg',
      title: 'Colección de Verano',
      subtitle: 'Estilo y rendimiento bajo el sol',
      description: 'Descubre nuestra nueva línea de ropa deportiva diseñada para mantenerte fresco y cómodo.',
      buttonText: 'Explorar ahora'
    },
    {
      image: 'assets/images/hero-2.jpg',
      title: 'Equipamiento para Correr',
      subtitle: 'Supera tus límites',
      description: 'Todo lo que necesitas para llevar tu carrera al siguiente nivel.',
      buttonText: 'Ver productos'
    },
    {
      image: 'assets/images/hero-3.jpg',
      title: 'Comodidad y Estilo',
      subtitle: 'Ropa para el día a día',
      description: 'Diseños versátiles que te acompañan del gimnasio a la calle.',
      buttonText: 'Descubrir más'
    }
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  setCurrentSlide(index: number): void {
    this.currentIndex = index;
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.slides.length - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }
} 
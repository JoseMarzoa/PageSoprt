import { Component, OnInit, OnDestroy } from '@angular/core';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides: CarouselSlide[] = [];
  currentSlide = 0;
  private interval: any;

  ngOnInit() {
    this.loadSlides();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private loadSlides() {
    this.slides = [
      {
        id: 1,
        title: 'Nueva Colección',
        subtitle: 'Verano 2024',
        description: 'Descubre la última tecnología en ropa deportiva diseñada para maximizar tu rendimiento',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
        buttonText: 'Ver Colección',
        buttonLink: '#'
      },
      {
        id: 2,
        title: 'Calzado Deportivo',
        subtitle: 'Máximo Confort',
        description: 'Zapatillas con tecnología avanzada para correr más rápido y más lejos',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop',
        buttonText: 'Explorar Calzado',
        buttonLink: '#'
      },
      {
        id: 3,
        title: 'Equipamiento',
        subtitle: 'Profesional',
        description: 'Todo lo que necesitas para llevar tu entrenamiento al siguiente nivel',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
        buttonText: 'Ver Equipamiento',
        buttonLink: '#'
      }
    ];
  }

  private startAutoPlay() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  pauseAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  resumeAutoPlay() {
    this.startAutoPlay();
  }
} 
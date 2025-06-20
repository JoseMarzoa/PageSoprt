import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides = [
    {
      image: 'https://placehold.co/1600x900/111827/FFFFFF?text=Colección+Verano',
      title: 'Colección de Verano',
      subtitle: 'Estilo y rendimiento bajo el sol',
    },
    {
      image: 'https://placehold.co/1600x900/1F2937/FFFFFF?text=Equipamiento',
      title: 'Equipamiento para Correr',
      subtitle: 'Supera tus límites',
    },
    {
      image: 'https://placehold.co/1600x900/374151/FFFFFF?text=Comodidad+y+Estilo',
      title: 'Comodidad y Estilo',
      subtitle: 'Ropa para el día a día',
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
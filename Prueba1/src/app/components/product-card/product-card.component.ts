import { Component, Input } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;

  addToCart() {
    console.log('Producto agregado al carrito:', this.product.name);
    // Aquí se implementaría la lógica para agregar al carrito
  }

  addToWishlist() {
    console.log('Producto agregado a favoritos:', this.product.name);
    // Aquí se implementaría la lógica para agregar a favoritos
  }

  getDiscountPercentage(): number {
    if (this.product.originalPrice) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }

  getStarRating(): string[] {
    const stars = [];
    const fullStars = Math.floor(this.product.rating);
    const hasHalfStar = this.product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('fas fa-star');
    }

    if (hasHalfStar) {
      stars.push('fas fa-star-half-alt');
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('far fa-star');
    }

    return stars;
  }
} 
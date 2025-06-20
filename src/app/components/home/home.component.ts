import { Component, OnInit } from '@angular/core';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  bestSellers: Product[] = [];

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadBestSellers();
  }

  private loadFeaturedProducts() {
    this.featuredProducts = [
      {
        id: 1,
        name: 'Nike Air Max 270',
        price: 129.99,
        originalPrice: 159.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        category: 'Calzado',
        rating: 4.8,
        reviews: 1247,
        isNew: true
      },
      {
        id: 2,
        name: 'Adidas Ultraboost 22',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
        category: 'Calzado',
        rating: 4.9,
        reviews: 892,
        isNew: true
      },
      {
        id: 3,
        name: 'Under Armour Tech 2.0',
        price: 89.99,
        originalPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        category: 'Ropa',
        rating: 4.7,
        reviews: 567,
        isNew: true
      }
    ];
  }

  private loadBestSellers() {
    this.bestSellers = [
      {
        id: 4,
        name: 'Nike Dri-FIT Training',
        price: 64.99,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        category: 'Ropa',
        rating: 4.9,
        reviews: 2156,
        isBestSeller: true
      },
      {
        id: 5,
        name: 'Adidas Tiro 21',
        price: 79.99,
        originalPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
        category: 'Ropa',
        rating: 4.8,
        reviews: 1893,
        isBestSeller: true
      },
      {
        id: 6,
        name: 'Puma RS-X',
        price: 109.99,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
        category: 'Calzado',
        rating: 4.7,
        reviews: 1342,
        isBestSeller: true
      }
    ];
  }
} 
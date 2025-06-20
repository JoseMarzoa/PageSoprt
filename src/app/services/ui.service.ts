import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private cartVisible = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisible.asObservable();

  constructor() { }

  toggleCart(): void {
    this.cartVisible.next(!this.cartVisible.value);
  }

  openCart(): void {
    this.cartVisible.next(true);
  }

  closeCart(): void {
    this.cartVisible.next(false);
  }
} 
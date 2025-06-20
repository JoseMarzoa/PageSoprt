import { Component, OnDestroy } from '@angular/core';
import { CarritoService, EstadoCarrito, ProductoCarrito } from '../../services/carrito.service';
import { UiService } from '../../services/ui.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnDestroy {
  isCartOpen = false;
  estadoCarrito$: Observable<EstadoCarrito>;
  private cartSubscription: Subscription;

  // Número de teléfono del vendedor
  private numeroVendedor = '59892984881'; // Reemplazar con el número real

  constructor(
    private carritoService: CarritoService,
    private uiService: UiService
  ) {
    this.estadoCarrito$ = this.carritoService.estadoCarrito$;
    this.cartSubscription = this.uiService.cartVisible$.subscribe(isVisible => {
      this.isCartOpen = isVisible;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  closeCart(): void {
    this.uiService.closeCart();
  }

  restar(productoId: number): void {
    this.carritoService.restarUnidad(productoId);
  }

  sumar(producto: ProductoCarrito): void {
    this.carritoService.agregarProducto({ ...producto, cantidad: 1 });
  }

  eliminar(productoId: number): void {
    this.carritoService.eliminarProducto(productoId);
  }

  realizarPedido(items: ProductoCarrito[]): void {
    if (items.length === 0) return;

    const mensaje = this.generarMensajeWhatsApp(items);
    const url = `https://wa.me/${this.numeroVendedor}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
  }

  private generarMensajeWhatsApp(items: ProductoCarrito[]): string {
    let mensaje = '¡Hola! Quisiera hacer un pedido con los siguientes productos:\n\n';
    
    items.forEach(item => {
      mensaje += `- *${item.nombre}*\n`;
      mensaje += `  Cantidad: ${item.cantidad}\n`;
      mensaje += `  Precio: ${item.precio.toFixed(2)} USD\n\n`;
    });

    const subtotal = items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    mensaje += `*Total del pedido: ${subtotal.toFixed(2)} USD*\n\n`;
    mensaje += `¡Muchas gracias!`;

    return mensaje;
  }
} 
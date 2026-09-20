import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { materialImports } from '../../shared/material-imports';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  imports: materialImports,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly cart = inject(CartService);
  readonly orderService = inject(OrderService);
  readonly userService = inject(UserService);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  update(id: number, event: Event) {
    this.cart.updateItem(id, Number((event.target as HTMLInputElement).value));
  }

  checkout() {
    const items = this.cart.lines().map((line) => ({
      product_id: line.productId,
      quantity: line.quantity,
      price_at_purchase: line.product.price,
    }));

    if (!items.length) {
      this.snack.open('Seu carrinho está vazio.', 'OK', { duration: 2500 });
      return;
    }

    this.orderService.create(this.userService.currentUser().id, items).subscribe({
      next: (order) => {
        this.cart.clear();
        this.router.navigate(['/checkout/success', order.id]);
      },
      error: () => {
        this.snack.open('Não foi possível concluir o pedido.', 'OK', { duration: 2500 });
      },
    });
  }
}

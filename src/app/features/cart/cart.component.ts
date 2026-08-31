import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { materialImports } from '../../shared/material-imports';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: materialImports,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly cart = inject(CartService);
  update(id: number, event: Event) {
    this.cart.updateItem(id, Number((event.target as HTMLInputElement).value));
  }
}

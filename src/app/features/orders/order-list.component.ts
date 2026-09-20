import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Order } from '../../models/api.models';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-order-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    CurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  readonly orderService = inject(OrderService);
  readonly userService = inject(UserService);
  readonly orders = signal<Order[]>([]);
  readonly displayedColumns = ['product_id', 'quantity', 'price_at_purchase'];

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    const userId = this.userService.currentUser().id;
    this.orderService.getByUserId(userId).subscribe((orders) => this.orders.set(orders));
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  totalAmount(order: Order): number {
    return Number(order.total_amount ?? 0);
  }
}

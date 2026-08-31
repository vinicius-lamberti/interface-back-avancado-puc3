import { AsyncPipe, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, shareReplay } from 'rxjs';
import { Product, WishlistItem } from '../../models/api.models';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    NgOptimizedImage,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  readonly wishlistService = inject(WishlistService);
  readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly snack = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly productRequests = new Map<number, Observable<Product>>();
  readonly list = computed(() =>
    this.wishlistService
      .wishlists()
      .find((item) => item.id === Number(this.route.snapshot.paramMap.get('id'))),
  );
  productFor(productId: number): Observable<Product> {
    const cached = this.productRequests.get(productId);
    if (cached) return cached;

    const request = this.productService
      .getById(productId)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    this.productRequests.set(productId, request);
    return request;
  }
  move(item: WishlistItem) {
    this.productService.getById(item.product_id).subscribe((product) => {
      this.cart.add(product);
      this.wishlistService.removeItem(item.wishlist_id, item.product_id).subscribe();
      this.snack.open('Movido para o carrinho', 'OK', { duration: 2500 });
    });
  }
}

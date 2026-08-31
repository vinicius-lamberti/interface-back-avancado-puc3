import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { materialImports } from '../../shared/material-imports';
import { Product } from '../../models/api.models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishlistDialogComponent } from '../wishlist';

@Component({
  selector: 'app-product',
  imports: [...materialImports, ReactiveFormsModule, MatDialogModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  readonly quantity = new FormControl(1, { nonNullable: true, validators: [Validators.min(1)] });
  readonly product = inject(ProductService).getById(Number(this.route.snapshot.paramMap.get('id')));
  add(product: Product) {
    const item = this.cart.add(product, this.quantity.value);
    this.cart.addItem(1, item).subscribe();
    this.snack.open('Produto adicionado ao carrinho', 'OK', { duration: 2500 });
  }
  favorite(product: Product) {
    const lists = this.wishlist.wishlists();
    if (lists.length > 1) {
      this.dialog
        .open(WishlistDialogComponent, { data: lists })
        .afterClosed()
        .subscribe(
          (id: number | undefined) => id && this.wishlist.addItem(id, product.id).subscribe(),
        );
    } else this.wishlist.addItem(lists[0].id, product.id).subscribe();
    this.snack.open('Salvo na sua lista de desejos', 'OK', { duration: 2500 });
  }
}

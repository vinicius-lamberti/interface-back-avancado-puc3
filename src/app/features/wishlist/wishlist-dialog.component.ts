import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Wishlist } from '../../models/api.models';

@Component({
  selector: 'app-wishlist-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './wishlist-dialog.component.html',
  styleUrl: './wishlist-dialog.component.scss',
})
export class WishlistDialogComponent {
  readonly data = inject<Wishlist[]>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<WishlistDialogComponent>);
}

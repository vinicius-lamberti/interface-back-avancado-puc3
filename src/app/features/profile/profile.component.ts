import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { materialImports } from '../../shared/material-imports';
import { UserService } from '../../services/user.service';
import { WishlistService } from '../../services/wishlist.service';
import { CreateWishlistDialogComponent } from '../wishlist/create-wishlist-dialog.component';

@Component({
  selector: 'app-profile',
  imports: [...materialImports, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly userService = inject(UserService);
  readonly wishlistService = inject(WishlistService);
  readonly email = new FormControl(this.userService.currentUser().email, { nonNullable: true });
  readonly password = new FormControl('', { nonNullable: true });
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  save() {
    this.userService
      .update(this.userService.currentUser().id, {
        username: this.userService.currentUser().username,
        email: this.email.value,
        password: this.password.value,
      })
      .subscribe(() => this.snack.open('Dados atualizados', 'OK', { duration: 2500 }));
  }
  create() {
    if (this.wishlistService.wishlists().length >= 4) {
      this.snack.open('Você já possui o limite de 4 listas.', 'OK', { duration: 2500 });
      return;
    }
    this.dialog
      .open(CreateWishlistDialogComponent, { width: 'min(28rem, calc(100vw - 2rem))' })
      .afterClosed()
      .subscribe((name: string | undefined) => {
        if (name) {
          this.wishlistService
            .create(this.userService.currentUser().id, name)
            .subscribe(() =>
              this.snack.open('Lista criada com sucesso.', 'OK', { duration: 2500 }),
            );
        }
      });
  }
}

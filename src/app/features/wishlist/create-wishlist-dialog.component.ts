import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-wishlist-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-wishlist-dialog.component.html',
  styleUrl: './create-wishlist-dialog.component.scss',
})
export class CreateWishlistDialogComponent {
  readonly name = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
  });
  readonly maxLists = inject<boolean>(MAT_DIALOG_DATA, { optional: true }) ?? false;
  readonly dialogRef = inject(MatDialogRef<CreateWishlistDialogComponent>);

  submit() {
    if (this.name.invalid) {
      this.name.markAsTouched();
      return;
    }
    this.dialogRef.close(this.name.value.trim());
  }
}

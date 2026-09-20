import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { materialImports } from '../../shared/material-imports';
import { ProductFilterPipe } from './product-filter.pipe';

@Component({
  selector: 'app-home',
  imports: [...materialImports, ProductFilterPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly products = signal(inject(ProductService).getProducts());
  readonly search = new FormControl('', { nonNullable: true });
  readonly sort = new FormControl('featured', { nonNullable: true });
  readonly searchValue = toSignal(this.search.valueChanges.pipe(debounceTime(250), startWith('')), {
    initialValue: '',
  });
}

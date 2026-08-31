import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../models/api.models';

@Pipe({ name: 'productFilter', standalone: true })
export class ProductFilterPipe implements PipeTransform {
  transform(products: Product[] | null, search: string, sort: string): Product[] {
    const filtered = (products ?? []).filter((product) =>
      `${product.title} ${product.category}`.toLowerCase().includes(search.toLowerCase()),
    );
    filtered.sort((a, b) => {
      if (sort === 'asc') return a.price - b.price;
      if (sort === 'desc') return b.price - a.price;
      return a.id - b.id;
    });
    return filtered;
  }
}

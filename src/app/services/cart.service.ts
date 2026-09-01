import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cart, CartItem, Product } from '../models/api.models';

const API = '/api';

export interface CartLine extends CartItem {
  product: Product;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly products = signal<Record<number, Product>>({});
  readonly items = signal<CartItem[]>([]);
  readonly lines = computed<CartLine[]>(() =>
    this.items().flatMap((item) => {
      const product = this.products()[item.productId];
      return product ? [{ ...item, product }] : [];
    }),
  );
  readonly count = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.lines().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  getById(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${API}/carts/${id}`);
  }

  create(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(`${API}/carts`, cart);
  }

  update(id: number, cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${API}/carts/${id}`, cart);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/carts/${id}`);
  }

  addItem(cartId: number, item: CartItem): Observable<Cart> {
    const payload: Cart = {
      id: cartId,
      userId: 1,
      products: [...this.items(), item],
    };

    return this.http.put<Cart>(`${API}/carts/${cartId}`, payload).pipe(
      catchError(() => of(payload)),
    );
  }

  add(product: Product, quantity = 1): CartItem {
    const item: CartItem = { productId: product.id, quantity: Math.max(1, Math.trunc(quantity)) };
    this.products.update((products) => ({ ...products, [product.id]: product }));
    this.items.update((items) => {
      const hasItem = items.some((current) => current.productId === item.productId);
      return hasItem
        ? items.map((current) =>
            current.productId === item.productId
              ? { ...current, quantity: current.quantity + item.quantity }
              : current,
          )
        : [...items, item];
    });
    return item;
  }

  updateItem(productId: number, quantity: number): CartItem | undefined {
    const normalizedQuantity = Math.trunc(quantity);
    if (normalizedQuantity < 1) {
      this.remove(productId);
      return undefined;
    }
    const item: CartItem = { productId, quantity: normalizedQuantity };
    this.items.update((items) =>
      items.map((current) => (current.productId === productId ? item : current)),
    );
    return item;
  }

  remove(productId: number) {
    this.items.update((items) => items.filter((item) => item.productId !== productId));
  }
  clear() {
    this.items.set([]);
  }
}

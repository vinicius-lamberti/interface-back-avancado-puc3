import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product, Wishlist, WishlistItem } from '../models/api.models';

const API = 'http://localhost:8000/api';

export interface WishlistEntry extends WishlistItem {
  product?: Product;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  readonly wishlists = signal<Wishlist[]>([]);
  readonly entries = computed(() =>
    this.wishlists().flatMap((list) => (list.items ?? []).map((item) => ({ ...item }))),
  );

  constructor() {
    this.getByUser(1).subscribe();
  }

  getByUser(userId: number): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${API}/wishlists/user/${userId}`).pipe(
      tap((lists) => this.wishlists.set(lists)),
    );
  }

  getById(id: number): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${API}/wishlists/${id}`).pipe(
      tap((wishlist) => {
        if (wishlist && typeof wishlist === 'object') {
          this.wishlists.update((lists) =>
            lists.some((current) => current.id === wishlist.id)
              ? lists.map((current) => (current.id === wishlist.id ? wishlist : current))
              : [...lists, wishlist],
          );
        }
      }),
    );
  }

  addItem(wishlistId: number, productId: number): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${API}/wishlists/${wishlistId}/items`, { product_id: productId }).pipe(
      tap((wishlist) =>
        this.wishlists.update((lists) =>
          lists.some((item) => item.id === wishlist.id)
            ? lists.map((item) => (item.id === wishlist.id ? wishlist : item))
            : [...lists, wishlist],
        ),
      ),
    );
  }

  removeItem(wishlistId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${API}/wishlists/${wishlistId}/items/${productId}`).pipe(
      tap(() =>
        this.wishlists.update((lists) =>
          lists.map((list) =>
            list.id === wishlistId
              ? { ...list, items: (list.items ?? []).filter((item) => item.product_id !== productId) }
              : list,
          ),
        ),
      ),
    );
  }

  create(userId: number, name: string): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${API}/wishlists`, { user_id: userId, name }).pipe(
      tap((wishlist) =>
        this.wishlists.update((lists) => (lists.length >= 4 ? lists : [...lists, wishlist])),
      ),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/wishlists/${id}`).pipe(
      tap(() => this.wishlists.update((lists) => lists.filter((list) => list.id !== id))),
    );
  }
}

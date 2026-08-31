import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product, Wishlist, WishlistItem } from '../models/api.models';

const API = 'http://localhost:8000/api';

export interface WishlistEntry extends WishlistItem {
  product?: Product;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  readonly wishlists = signal<Wishlist[]>([
    { id: 1, user_id: 1, name: 'Favoritos', items: [] },
    { id: 2, user_id: 1, name: 'Para a casa nova', items: [] },
  ]);
  readonly entries = computed(() =>
    this.wishlists().flatMap((list) => (list.items ?? []).map((item) => ({ ...item }))),
  );

  getByUser(userId: number): Observable<Wishlist[]> {
    return this.http
      .get<Wishlist[]>(`${API}/users/${userId}/wishlists`)
      .pipe(catchError(() => of(this.wishlists())));
  }

  getById(id: number): Observable<Wishlist> {
    return this.http
      .get<Wishlist>(`${API}/wishlists/${id}`)
      .pipe(
        catchError(() =>
          of(this.wishlists().find((list) => list.id === id) ?? this.wishlists()[0]),
        ),
      );
  }

  addItem(wishlistId: number, productId: number): Observable<WishlistItem> {
    const item: WishlistItem = { id: Date.now(), wishlist_id: wishlistId, product_id: productId };
    this.wishlists.update((lists) =>
      lists.map((list) =>
        list.id === wishlistId &&
        !(list.items ?? []).some((current) => current.product_id === productId)
          ? { ...list, items: [...(list.items ?? []), item] }
          : list,
      ),
    );
    return this.http
      .post<WishlistItem>(`${API}/wishlists/${wishlistId}/items`, { product_id: productId })
      .pipe(catchError(() => of(item)));
  }

  removeItem(wishlistId: number, productId: number): Observable<void> {
    this.wishlists.update((lists) =>
      lists.map((list) =>
        list.id === wishlistId
          ? { ...list, items: (list.items ?? []).filter((item) => item.product_id !== productId) }
          : list,
      ),
    );
    return this.http
      .delete<void>(`${API}/wishlists/${wishlistId}/items/${productId}`)
      .pipe(catchError(() => of(void 0)));
  }

  create(userId: number, name: string): Observable<Wishlist> {
    const wishlist: Wishlist = { id: Date.now(), user_id: userId, name, items: [] };
    this.wishlists.update((lists) => (lists.length >= 4 ? lists : [...lists, wishlist]));
    return this.http
      .post<Wishlist>(`${API}/wishlists`, { user_id: userId, name })
      .pipe(catchError(() => of(wishlist)));
  }

  delete(id: number): Observable<void> {
    this.wishlists.update((lists) => lists.filter((list) => list.id !== id));
    return this.http.delete<void>(`${API}/wishlists/${id}`).pipe(catchError(() => of(void 0)));
  }
}

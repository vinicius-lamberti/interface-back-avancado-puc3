import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Order } from '../models/api.models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  readonly orders = signal<Order[]>([]);

  create(userId: number, items: Order['items']): Observable<Order> {
    const payload = {
      user_id: userId,
      items,
    };

    return this.http.post<Order>(`${API}/orders`, payload);
  }

  getByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${API}/orders/user/${userId}`).pipe(
      catchError(() => of([])),
      map((orders) => {
        const normalized = [...orders].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        this.orders.set(normalized);
        return normalized;
      }),
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/api.models';

const API = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API}/products`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API}/products/${id}`);
  }
}

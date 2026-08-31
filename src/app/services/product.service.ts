import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../models/api.models';

const API = 'http://localhost:8000/api';

const catalog: Product[] = [
  {
    id: 1,
    title: 'Câmera instantânea Mini 12',
    description: 'Câmera compacta para registrar momentos com charme analógico.',
    price: 489.9,
    category: 'Tecnologia',
    image:
      'https://images.unsplash.com/photo-1606986628253-9f4b7c7f7d53?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Fone QuietComfort 45',
    description: 'Som imersivo e conforto para acompanhar seu ritmo.',
    price: 1299.9,
    category: 'Áudio',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Mochila Everyday 20L',
    description: 'Design leve e resistente para a rotina urbana.',
    price: 379.0,
    category: 'Acessórios',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Tênis Cloudnova Form',
    description: 'Performance e estilo em uma passada macia.',
    price: 899.0,
    category: 'Calçados',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Relógio Minimalist Steel',
    description: 'Precisão e presença com acabamento em aço escovado.',
    price: 649.9,
    category: 'Acessórios',
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Luminária Sensa',
    description: 'Luz ambiente para transformar seu espaço.',
    price: 249.9,
    category: 'Casa',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API}/products`).pipe(catchError(() => of(catalog)));
  }

  getById(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${API}/products/${id}`)
      .pipe(catchError(() => of(catalog.find((product) => product.id === id) ?? catalog[0])));
  }
}

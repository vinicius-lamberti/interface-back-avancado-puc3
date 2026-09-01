import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthLoginResponse, User } from '../models/api.models';

const API = 'http://localhost:8000/api';

export type UserUpdate = Pick<User, 'username' | 'email'> & Partial<Pick<User, 'password'>>;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<User>({
    id: 1,
    username: 'johnd',
    email: 'john@gmail.com',
    password: 'm38rmF$',
    name: {
      firstname: 'john',
      lastname: 'doe',
    },
    address: {
      city: 'kilcoole',
      street: 'new road',
      number: 7682,
      zipcode: '12926-3874',
      geolocation: {
        lat: '-37.3159',
        long: '81.1496',
      },
    },
    phone: '1-570-236-7033',
  });

  login(username: string, password: string): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(`${API}/auth/login`, { username, password });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${API}/users/${id}`);
  }

  update(id: number, update: UserUpdate): Observable<User> {
    const payload: User = {
      ...this.currentUser(),
      id,
      username: update.username,
      email: update.email,
      ...(update.password ? { password: update.password } : {}),
    };

    return this.http.put<User>(`${API}/users/${id}`, payload).pipe(
      tap((user) => this.currentUser.set(user)),
    );
  }
}

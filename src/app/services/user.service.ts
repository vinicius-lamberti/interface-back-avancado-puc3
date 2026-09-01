import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthLoginResponse, User } from '../models/api.models';

const API = '/api';

export type UserUpdate = Pick<User, 'username' | 'email'> & Partial<Pick<User, 'password'>>;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<User>({
    id: 1,
    username: 'Marina Costa',
    email: 'marina@aurora.store',
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
    this.currentUser.set(payload);
    return this.http.put<User>(`${API}/users/${id}`, payload).pipe(catchError(() => of(payload)));
  }
}

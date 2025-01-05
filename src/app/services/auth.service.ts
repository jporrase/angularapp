// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  email: string;
  finca?: string;
  owner?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://shark-app-2-ogevj.ondigitalocean.app/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(userData: User): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      tap(users => {
        const user = users.find(u => u.email === userData.email);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  signup(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap(response => {
        localStorage.setItem('user', JSON.stringify(userData));
      })
    );
  }
  saveUserSchema(email: string, componentName: string, schema: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${email}/schema`, {
      [componentName]: schema
    });
  }

  // Get schema for a specific user and component
  getUserSchema(email: string, componentName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${email}/schema/${componentName}`);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/form']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }
}
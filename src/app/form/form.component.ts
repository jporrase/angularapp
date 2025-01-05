import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  private apiUrl = 'http://64.23.239.3:4000/api';
  finca: string = '';
  owner: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  showNewPasswordField: boolean = false;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {}

  onSubmit(form: any): void {
    if (!this.email || !this.password) {
      alert('Email and password are required for login.');
      return;
    }
  
    // Using your existing API endpoint but with full URL
    this.http.get<{ email: string; password: string }[]>(`${this.apiUrl}/users`).subscribe({
      next: (users) => {
        const user = users.find(
          (u) => u.email === this.email && u.password === this.password
        );
  
        if (user) {
          // Store user data in AuthService
          localStorage.setItem('user', JSON.stringify(user));
          const currentUser = this.authService.getCurrentUser();
          console.log('Current user:', currentUser?.email);
          console.log('Farm name:', currentUser?.finca);
          this.router.navigate(['/comite']);
        } else {
          alert('Invalid email or password. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to log in. Please try again later.');
      },
    });
  }

  onSignUp(): void {
    if (!this.email || !this.password) {
      alert('Email and password are required for sign-up.');
      return;
    }

    const userData = { 
      email: this.email, 
      password: this.password,
      finca: this.finca,
      owner: this.owner,
      phone: this.phone
    };

    this.http.post<{ message: string }>(`${this.apiUrl}/signup`, userData).subscribe({
      next: (response) => {
        console.log('Server Response:', response);
        alert(response.message || 'User signed up successfully!');
        // Store user data in AuthService
        localStorage.setItem('user', JSON.stringify(userData));
        this.router.navigate(['/comite']);
      },
      error: (error) => {
        console.error('Sign Up Error:', error);
        const errorMessage = error.error?.message || 'Sign Up failed. Please try again.';
        alert(errorMessage);
      },
    });
  }

  onPasswordReset(): void {
    if (!this.email) {
      alert('Email is required to reset your password.');
      return;
    }

    const resetData = { email: this.email };

    this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, resetData).subscribe({
      next: (response) => {
        console.log('Server Response:', response);
        alert(response.message || 'Email verified. Enter a new password below.');
        this.showNewPasswordField = true;
      },
      error: (error) => {
        console.error('Password Reset Error:', error);
        const errorMessage = error.error?.message || 'Failed to verify email. Please try again.';
        alert(errorMessage);
      },
    });
  }

  onUpdatePassword(): void {
    if (!this.newPassword || !this.oldPassword) {
      alert('Both old and new passwords are required.');
      return;
    }

    const updateData = {
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.http.post<{ message: string }>(`${this.apiUrl}/update-password`, updateData).subscribe({
      next: (response) => {
        console.log('Server Response:', response);
        alert(response.message || 'Password updated successfully!');
        this.showNewPasswordField = false;
        this.newPassword = '';
        this.oldPassword = '';
      },
      error: (error) => {
        console.error('Update Password Error:', error);
        const errorMessage = error.error?.message || 'Failed to update password. Please try again.';
        alert(errorMessage);
      },
    });
  }
}
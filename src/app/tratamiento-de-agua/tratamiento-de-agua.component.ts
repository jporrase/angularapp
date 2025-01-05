import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tratamiento-de-agua',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tratamiento-de-agua.component.html',
  styleUrls: ['./tratamiento-de-agua.component.css'],
})
export class TratamientoDeAguaComponent implements OnInit {
  tratamientoForm = {
    fecha: '',
    volumen: '',
    producto: '',
    cantidad: null,
    foto: null,
  };

  currentUser: any = null;
  private apiUrl = 'http://64.23.239.3:4000/api';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}


  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.email) {
      // Load existing schema if it exists
      this.http.get(`${this.apiUrl}/users/${this.currentUser.email}/schema`)
        .subscribe({
          next: (response: any) => {
            if (response?.tratamiento) {
              this.tratamientoForm = response.tratamiento;
            }
          },
          error: (error) => {
            console.error('Error loading schema:', error);
          }
        });
    }
  }

  onSubmit(form: any): void {
    if (form.valid && this.currentUser?.email) {
      // Save the schema
      this.http.put(`${this.apiUrl}/users/${this.currentUser.email}/schema`, {
        tratamiento: this.tratamientoForm
      }).subscribe({
        next: (response) => {
          console.log('Schema saved successfully:', response);
          this.router.navigate(['/higiene-instalaciones'])
        },
        error: (error) => {
          console.error('Error saving schema:', error);
          alert('Error al guardar los datos.');
        }
      });
    }
  }

  goToTable(): void {
    console.log('Navigating to table...');
  }

  goBack(): void {
    console.log('Navigating back...');
    this.router.navigate(['/cosecha']);
  }
}

// consumo-de-agua.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consumo-de-agua',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './consumo-de-agua.component.html',
  styleUrls: ['./consumo-de-agua.component.css'],
})
export class ConsumoDeAguaComponent implements OnInit {
  consumoAguaForm = {
    fechaRiego: '',
    hora: '',
    cantidadAguaUtilizada: null,
    aguaParaPlaguicidas: '',
  };

  currentUser: any = null;
  private apiUrl = 'https://shark-app-2-ogevj.ondigitalocean.app/api';

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
            if (response?.consumoDeAgua) {
              this.consumoAguaForm = response.consumoDeAgua;
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
        consumoDeAgua: this.consumoAguaForm
      }).subscribe({
        next: (response) => {
          console.log('Schema saved successfully:', response);
          this.router.navigate(['/cosecha'])
        },
        error: (error) => {
          console.error('Error saving schema:', error);
          alert('Error al guardar los datos.');
        }
      });
    }
  }

  goToTable(): void {
    // Implement table view logic here
    console.log('Navigating to table...');
  }

  goBack(): void {
    this.router.navigate(['/fertilizantes']);
  }
}
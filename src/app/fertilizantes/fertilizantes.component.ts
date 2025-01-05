import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fertilizantes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fertilizantes.component.html',
  styleUrls: ['./fertilizantes.component.css'],
})
export class FertilizantesComponent implements OnInit{
  fertilizantesForm = {
    fechaAplicacion: '',
    hora: '',
    productoAplicado: '',
    dosisMochila: null,
    cantidadTotalAplicada: null,
    frecuenciaAplicacion: '',
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
            if (response?.fertilizantes) {
              this.fertilizantesForm = response.fertilizantes;
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
        fertilizantes: this.fertilizantesForm
      }).subscribe({
        next: (response) => {
          console.log('Schema saved successfully:', response);
          this.router.navigate(['/consumo-de-agua'])
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
    this.router.navigate(['/fitosanitarios']);
  }
}

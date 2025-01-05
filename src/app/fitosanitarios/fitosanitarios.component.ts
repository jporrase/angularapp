import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fitosanitarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fitosanitarios.component.html',
  styleUrls: ['./fitosanitarios.component.css'],
})
export class FitosanitariosComponent implements OnInit{
  fitosanitariosForm = {
    fechaAplicacion: '',
    hora: '',
    enfermedadControl: '',
    severidad: '',
    productoAplicado: '',
    dosisMochila: null,
    dosisTonel: null,
    cantidadAplicada: null,
    frecuenciaAplicacion: null,
    fotoAreaDanada: '',
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
            if (response?.fitosanitarios) {
              this.fitosanitariosForm = response.fitosanitarios;
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
        fitosanitarios: this.fitosanitariosForm
      }).subscribe({
        next: (response) => {
          console.log('Schema saved successfully:', response);
          this.router.navigate(['/fertilizantes'])
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
    this.router.navigate(['/comite']);
  }
}

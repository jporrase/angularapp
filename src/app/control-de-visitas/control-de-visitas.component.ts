import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-control-de-visitas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './control-de-visitas.component.html',
  styleUrls: ['./control-de-visitas.component.css'],
})
export class ControlDeVisitasComponent implements OnInit {
  visitaForm = {
    fechaVisita: '',
    horaLlegada: '',
    horaSalida: '',
    nombreVisitante: '',
    numeroDpi: '',
    cantPersonasVehiculo: '',
    tipoAutomovil: '',
    placasVehiculo: '',
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
            if (response?.visita) {
              this.visitaForm = response.visita;
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
        visita: this.visitaForm
      }).subscribe({
        next: (response) => {
          console.log('Schema saved successfully:', response);
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
    this.router.navigate(['/table']);
  }

  goBack(): void {
    console.log('Navigating back...');
    this.router.navigate(['/higiene-instalaciones']);
  }
}

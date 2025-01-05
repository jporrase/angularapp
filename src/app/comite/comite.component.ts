import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Needed for structural directives like *ngIf
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-comite',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Import FormsModule here
  templateUrl: './comite.component.html',
  styleUrls: ['./comite.component.css'],
})

export class ComiteComponent {
  selectedCommittee: string = ''; // Tracks the selected committee

  // Define the committee options
  options: string[] = ['AGUACATE'];

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
            if (response?.comite) {
              this.selectedCommittee = response.comite;
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
        comite: this.selectedCommittee
      }).subscribe({
        next: (response) => {
          console.log('Schema saved successfully:', response);
          this.router.navigate(['/fitosanitarios'])
        },
        error: (error) => {
          console.error('Error saving schema:', error);
          alert('Error al guardar los datos.');
        }
      });
    }
  }
}

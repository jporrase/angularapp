import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormComponent } from './app/form/form.component';
import { ComiteComponent } from './app/comite/comite.component';
import { FitosanitariosComponent } from './app/fitosanitarios/fitosanitarios.component';
import { CosechaComponent } from './app/cosecha/cosecha.component';
import { FertilizantesComponent } from './app/fertilizantes/fertilizantes.component';
import { ConsumoDeAguaComponent } from './app/consumo-de-agua/consumo-de-agua.component';
import { TratamientoDeAguaComponent } from './app/tratamiento-de-agua/tratamiento-de-agua.component';
import { HigieneInstalacionesComponent } from './app/higiene-instalaciones/higiene-instalaciones.component';
import { ControlDeVisitasComponent } from './app/control-de-visitas/control-de-visitas.component';
import { TableComponent } from './app/table/table.component';
import { provideHttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './app/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="app-container" [class.with-sidebar]="authService.isLoggedIn()">
      <!-- Side Navigation -->
      <nav *ngIf="authService.isLoggedIn()" class="sidebar">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <img
              src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQlafXHcrQTZ8WHiVYU-3EL-HLkJL5fKYKqDWroXX7FPrQ9yq92"
              alt="Logo"
              class="logo"
            />
            <h3>{{ getFarmName() }}</h3>
          </div>

          <div class="menu-items">
            <a routerLink="/comite" routerLinkActive="active">
              <i class="fas fa-users"></i> Comité
            </a>
            <a routerLink="/fitosanitarios" routerLinkActive="active">
              <i class="fas fa-leaf"></i> Fitosanitarios
            </a>
            <a routerLink="/fertilizantes" routerLinkActive="active">
              <i class="fas fa-flask"></i> Fertilizantes
            </a>
            <a routerLink="/consumo-de-agua" routerLinkActive="active">
              <i class="fas fa-tint"></i> Consumo De Agua
            </a>
            <a routerLink="/cosecha" routerLinkActive="active">
              <i class="fas fa-seedling"></i> Cosecha
            </a>
            <a routerLink="/tratamiento-de-agua" routerLinkActive="active">
              <i class="fas fa-filter"></i> Tratamiento de Agua
            </a>
            <a routerLink="/higiene-instalaciones" routerLinkActive="active">
              <i class="fas fa-broom"></i> Higiene Instalaciones
            </a>
            <a routerLink="/control-de-visitas" routerLinkActive="active">
              <i class="fas fa-clipboard-list"></i> Control de Visitas
            </a>
            <a routerLink="/table" routerLinkActive="active">
              <i class="fas fa-table"></i> Tabla
            </a>
          </div>
        </div>

        <button (click)="logout()" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </nav>

      <!-- Main Content -->
      <main [class.with-sidebar]="authService.isLoggedIn()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
    }

    .sidebar {
      width: 250px;
      height: 100vh;
      position: fixed;
      background-color: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
    }

    .sidebar-content {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .sidebar-header {
      text-align: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #34495e;
      margin-bottom: 1rem;
    }

    .logo {
      width: 120px;
      height: auto;
      margin-bottom: 1rem;
      border-radius: 10px;
      padding: 10px;
      background-color: white;
    }

    .menu-items {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow-y: auto;
    }

    .menu-items a {
      color: #ecf0f1;
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 5px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .menu-items a:hover {
      background-color: #34495e;
      transform: translateX(5px);
    }

    .menu-items a.active {
      background-color: #3498db;
    }

    .menu-items i {
      width: 20px;
      text-align: center;
    }

    .logout-btn {
      width: 100%;
      padding: 1rem;
      background-color: #c0392b;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: auto;
    }

    .logout-btn:hover {
      background-color: #e74c3c;
    }

    main {
      flex: 1;
      padding: 2rem;
      transition: margin-left 0.3s ease;
    }

    main.with-sidebar {
      margin-left: 250px;
    }

    h3 {
      margin: 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    @media (max-height: 600px) {
      .sidebar {
        overflow-y: auto;
      }

      .menu-items {
        overflow-y: auto;
      }
    }
  `]
})
export class App {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  getFarmName() {
    const user = this.authService.getCurrentUser();
    return user?.finca || 'Mi Finca';
  }
}

interface AuthGuardService {
  isLoggedIn(): boolean;
}

// Add this guard function
const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() ? true : '/form';
};

const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: '',
    canActivate: [authGuard], // Apply guard once to parent
    children: [
      { path: 'comite', component: ComiteComponent },
      { path: 'fitosanitarios', component: FitosanitariosComponent },
      { path: 'cosecha', component: CosechaComponent },
      { path: 'fertilizantes', component: FertilizantesComponent },
      { path: 'consumo-de-agua', component: ConsumoDeAguaComponent },
      { path: 'tratamiento-de-agua', component: TratamientoDeAguaComponent },
      { path: 'higiene-instalaciones', component: HigieneInstalacionesComponent },
      { path: 'control-de-visitas', component: ControlDeVisitasComponent },
      { path: 'table', component: TableComponent },
    ]
  },
  { path: '**', redirectTo: '/form' }
];

// Bootstrap the application
bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Setting up the router
    provideHttpClient(), // Provide the HttpClient globally
  ],
});

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Hello from {{ name }}!</h1>
    <nav>
      <a routerLink="/form">Form</a>
      <a routerLink="/comite">Comite</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  imports: [RouterModule],
})
export class App {
  name = 'Angular';
}

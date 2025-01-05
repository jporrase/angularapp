import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component'; // Import FormComponent
import { ComiteComponent } from './comite/comite.component'; // Import ComiteComponent
import { FitosanitariosComponent } from './fitosanitarios/fitosanitarios.component';
import { CosechaComponent } from './cosecha/cosecha.component';

const routes: Routes = [
  { path: 'form', component: FormComponent }, // Route to load the form component
  { path: 'comite', component: ComiteComponent }, // Route to load the comite component
  { path: 'fitosanitarios', component: FitosanitariosComponent }, // Route to load the comite component
  { path: 'cosecha', component: CosechaComponent },
  { path: '', redirectTo: '/comite', pathMatch: 'full' }, // Redirect to form if no route is matched
  { path: '**', redirectTo: '/comite' }, // Fallback to form for any unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

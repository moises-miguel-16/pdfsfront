import { DetalleComponent } from './dashboard/detalle/detalle.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const childRoutes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'detalle/:id/:descripcion', component: DetalleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

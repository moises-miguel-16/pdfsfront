import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { HttpClientModule } from '@angular/common/http';
import { DetalleComponent } from './dashboard/detalle/detalle.component';
import { ModalDetalleComponent } from './dashboard/modal-detalle/modal-detalle.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    DetalleComponent,
    ModalDetalleComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule,
    HttpClientModule
  ],
  exports:[
    PagesComponent,
    DashboardComponent,
    DetalleComponent,
    ModalDetalleComponent
  ]
})
export class PagesModule { }

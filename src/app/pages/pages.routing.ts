import { PagesComponent } from './pages.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
     
        loadChildren: () => import('./pages-routing.module').then( m => m.PagesRoutingModule )
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}

import { TablaService } from './../../services/tabla.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  infoTabla = [];
  constructor( public tablaService: TablaService ) { }

  ngOnInit(): void {
    this.tablaService.cargarInfoTabla().subscribe( (res:any) => {
      this.infoTabla = res.data;
      console.log(this.infoTabla)
    })
  }

}

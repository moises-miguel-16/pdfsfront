import { TablaService } from './../../services/tabla.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
//desde=2021-06-01&hasta=2021-08-04
  infoTabla = [];

  //MES ANTES

  fechaInicio = '2021-06-01';
  fechaFin = '2021-08-04';
  constructor( public tablaService: TablaService ) { }

  ngOnInit(): void {
    this.tablaService.cargarInfoTabla(this.fechaInicio,this.fechaFin).subscribe( (res:any) => {
      this.infoTabla = res.data;
      console.log(this.infoTabla)
    })
  }

  buscarPorRango(){

    this.fechaInicio = (<HTMLInputElement>document.getElementById('inputFechaInicio')).value;
    this.fechaFin = (<HTMLInputElement>document.getElementById('inputFechaFin')).value;
    if(this.fechaInicio && this.fechaFin){
      this.tablaService.cargarInfoTabla(this.fechaInicio,this.fechaFin).subscribe( (res:any) => {
        this.infoTabla = res.data;
        console.log(this.infoTabla)
      })
    }else{
      Swal.fire('Oops','Ingrese correctamente las fechas','error')
    }
    
  }

}

import { TablaService } from './../../services/tabla.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
//desde=2021-06-01&hasta=2021-08-04
  infoTabla = [];

  fechaInicio = '';
  fechaFin = '';
  cargando = false;
  fechaFin2Day = new Date().getUTCDate().toString();
  fechaFin2Month = new Date().getUTCMonth().toString();
  fechaFin2Year = new Date().getUTCFullYear().toString();

  faMes = new Date().toString().split(' ')[1]
  faDia = new Date().toString().split(' ')[2]
  faAnio = new Date().toString().split(' ')[3]

  constructor( public tablaService: TablaService ) { }

  ngOnInit(): void {

    switch(this.faMes){
      case 'Jan': this.faMes = '1';break;
      case 'Feb': this.faMes = '2';break;
      case 'Mar': this.faMes = '3';break;
      case 'Apr': this.faMes = '4';break;
      case 'May': this.faMes = '5';break;
      case 'Jun': this.faMes = '6';break;
      case 'Jul': this.faMes = '7';break;
      case 'Aug': this.faMes = '8';break;
      case 'Set': this.faMes = '9';break;
      case 'Oct': this.faMes = '10';break;
      case 'Nov': this.faMes = '11';break;
      case 'Dec': this.faMes = '12';break;
    }

    if(this.fechaFin2Month.length == 1){
      this.fechaFin2Month = '0'+this.fechaFin2Month
    }
    if(this.fechaFin2Day.length == 1){
      this.fechaFin2Day = '0'+this.fechaFin2Day
    }
    if(this.faMes.length == 1){
      this.faMes = '0'+this.faMes
    }
    if(this.faDia.length == 1){
      this.faDia = '0'+this.faDia
    }
    
    let fechaAntes = this.fechaFin2Year+"-"+this.fechaFin2Month+"-"+this.fechaFin2Day
    let fechaDsps = this.faAnio+"-"+this.faMes+"-"+this.faDia

    console.log(fechaDsps,fechaAntes);
    (<HTMLInputElement>document.getElementById('inputFechaInicio')).value = fechaAntes;
    (<HTMLInputElement>document.getElementById('inputFechaFin')).value = fechaDsps;

    this.tablaService.cargarInfoTabla(fechaAntes,fechaDsps).subscribe( (res:any) => {
      this.infoTabla = res;
      console.log(this.infoTabla)
    })
  }

  buscarPorRango(){
    
    this.fechaInicio = (<HTMLInputElement>document.getElementById('inputFechaInicio')).value;
    this.fechaFin = (<HTMLInputElement>document.getElementById('inputFechaFin')).value;

    console.log(this.fechaInicio,this.fechaFin)

    if(this.fechaInicio.length>0 && this.fechaFin.length>0){
      this.tablaService.cargarInfoTabla(this.fechaInicio,this.fechaFin)
      .pipe(
        tap( _ => {
          this.cargando = true;
        } )
      )
      .subscribe( (res:any) => {
        this.infoTabla = res;
        console.log(this.infoTabla)
        this.cargando = false;
      })
    }else{
      Swal.fire('Oops','Ingrese correctamente las fechas','error')
    }
    
  }

}

import { ModalDetalleComponent } from './../modal-detalle/modal-detalle.component';
import { TablaService } from './../../../services/tabla.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  public id:any;
  public descripcion:any;
  public detalles= [];


  constructor( route: ActivatedRoute, public tablaService:TablaService,   private modalService: NgbModal,
    ) { 
    this.id = route.snapshot.params.id;
    this.descripcion = route.snapshot.params.descripcion;

  }

  ngOnInit(): void {
    this.tablaService.cargarInfoTablaDetallada(this.id).subscribe( (data:any) => {
      this.detalles = data.data;
      
    } );
  }

  public async abrirModal(elemento :any ){
    let modalRef;
    modalRef = this.modalService.open(ModalDetalleComponent, {
      centered: true,
      size: 'xl'
    });
    modalRef.componentInstance.Elemento = elemento;

    try{
      const res = await modalRef.result;
      if(res == 'ok'){
        console.log('ALL IS OK')
      }
    }catch(err){
      console.log('ventana cerrada')
    };
    
  }

}

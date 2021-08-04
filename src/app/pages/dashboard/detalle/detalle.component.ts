import { ModalDetalleComponent } from './../modal-detalle/modal-detalle.component';
import { TablaService } from './../../../services/tabla.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from "jspdf";




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
      // size: 'xl'
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
  descargar(){
    // this.detalles.forEach( detalle => {
    //   this.descargarDetalle(detalle);
    // } )

    this.descargarDetalle(this.detalles[0]);
    // this.descargarDetalle(this.detalles[1]);
    // this.descargarDetalle(this.detalles[2]);
  }
  descargarDetalle( detalle:any ){
    let doc = new jsPDF();
    doc.setFontSize(10);
    // doc.setFont('system-ui');
    doc.text(detalle.planilla,15,20);
    // doc.text('DETALLE',15, 30);
    doc.addImage('./assets/imgs/detalle.PNG','PNG',15,27,25,6);

    doc.addImage('./assets/imgs/barraizquierda.png','PNG',10,10,2,25);
    doc.addImage('./assets/imgs/insignia.png','PNG',175,10,25,25);

    //TEXTO DE LOS ITEMS
    for( let i=0;i<detalle.detalle.length;i++ ){
      let infoDetalle = detalle.detalle[i];
      if(infoDetalle.descripcion.length > 35){
        doc.text(infoDetalle.descripcion.substring(0,35),20,55+5*2*i);
        doc.text(infoDetalle.descripcion.substring(35,infoDetalle.descripcion.length),20,55+5*2*i+5);

      }else{
        doc.text(infoDetalle.descripcion,20,55+5*2*i);
      }
      doc.text(infoDetalle.descuento.toString(),185,55+5*2*i);
      doc.addImage('./assets/imgs/check.png','PNG',14,(51+5*2*i),4,4);
    }
    //IMPORTE TOTAL
    // doc.setFont("bold");
    doc.text('IMPORTE TOTAL',135, 60+5*2*detalle.detalle.length);
    
    doc.text(detalle.montopago,180, 60+5*2*detalle.detalle.length);
    //TEXTO DE LA FECHA
    doc.text(this.transformFecha(detalle.detalle[0].fechapago),15, 70+5*2*detalle.detalle.length+10);

    //LINEA
    doc.addImage('./assets/imgs/lineahorizontal.png','PNG',126,70+5*2*detalle.detalle.length+15,
    detalle.apellido.length+detalle.nombre.length*10
    
    ,7);
    //Propietario
    doc.text((detalle.apellido+" "+detalle.nombre),136, 70+5*2*detalle.detalle.length+25)

    


    //CIMA chiquito
    doc.addImage('./assets/imgs/cimachiquito.png','PNG',10,70+5*2*detalle.detalle.length+35,20,7);


    doc.addImage('./assets/imgs/footer.png','PNG',0,257,230,40);

    doc.save("a4.pdf");
  }

  transformFecha( fecha:any ):any{
    let arrayfecha = fecha.split('-');
    console.log(arrayfecha);
    let anio = arrayfecha[0];
    let mes = arrayfecha[1];
    let dia = arrayfecha[2];

    switch(mes){
      case "01": mes = 'ENERO';break;
      case "02": mes = 'FEBRERO';break;
      case "03": mes = 'MARZO';break;
      case "04": mes = 'ABRIL';break;
      case "05": mes = 'MAYO';break;
      case "06": mes = 'JUNIO';break;
      case "07": mes = 'JULIO';break;
      case "08": mes = 'AGOSTO';break;
      case "09": mes = 'SETIEMBRE';break;
      case "10": mes = 'OCTUBRE';break;
      case "11": mes = 'NOVIEMBRE';break;
      case "12": mes = 'DICIEMBRE';break;
    }

    return dia+" DE "+mes+" DEL "+anio;

  }

}

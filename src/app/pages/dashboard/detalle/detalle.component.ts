import { ModalDetalleComponent } from './../modal-detalle/modal-detalle.component';
import { TablaService } from './../../../services/tabla.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from "jspdf";
import { token } from "./SEGOEUI-normal"

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  public id:any;
  public fechaInicio:any;
  public fechaFin:any;


  public descripcion:any;
  public detalles= [];


  constructor( route: ActivatedRoute, public tablaService:TablaService,   private modalService: NgbModal,
    ) { 
    this.id = route.snapshot.params.id;
    this.fechaInicio = route.snapshot.params.fechaInicio;
    this.fechaFin = route.snapshot.params.fechaFin;



    this.descripcion = route.snapshot.params.descripcion;

  }

  ngOnInit(): void {
    this.tablaService.cargarInfoTablaDetallada(this.id,this.fechaInicio,this.fechaFin).subscribe( (data:any) => {
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
    // this.descargarDetalle(this.detalles[21]);
    // this.descargarDetalle(this.detalles[2]);
  }
  descargarDetalle( detalle:any ){
    let doc = new jsPDF();
    console.log(doc.getFontList());
    doc.setFontSize(10);
    doc.addFileToVFS('SEGOEUI-normal.ttf', token)
    doc.addFont('SEGOEUI-normal.ttf', 'SEGOEUI', 'normal');
    console.log(doc.getFontList());

    doc.setFillColor(255, 255, 200);
    doc.rect(15, 11, 73, 10, 'F');

    doc.setFontSize(13);
    doc.text(detalle.planilla,15.8,18);
    doc.text(detalle.planilla,15.9,18);
    doc.text(detalle.planilla,16,18);
    doc.setFontSize(10);
    doc.setFillColor(128, 229, 255);
    doc.rect(15, 25, 40, 7, 'F');

    doc.text('DETALLE',15.8,29.8);
    doc.text('DETALLE',15.9,29.9);
 

    doc.addImage('./assets/imgs/barraizquierda.png','PNG',10,10,2,25);
    doc.addImage('./assets/imgs/insignia.png','PNG',175,10,25,25);

    //TEXTO DE LOS ITEMS
    for( let i=0;i<detalle.detalle.length;i++ ){
      let infoDetalle = detalle.detalle[i];
      
      if(infoDetalle.descripcion.length > 58){
        doc.setFont("SEGOEUI","normal")
        doc.text(infoDetalle.descripcion.substring(0,58),20,55+5*1.5*i);
        doc.setFont("SEGOEUI","normal")
        doc.text(infoDetalle.descripcion.substring(58,infoDetalle.descripcion.length),20,55+5*1.5*i+4);

      }else{
        doc.setFont("SEGOEUI","normal")
        doc.text(infoDetalle.descripcion,20,55+5*1.5*i);
      }
      // doc.setFont("SEGOEUI","normal")
      // doc.text(infoDetalle.descripcion,20,55+5*2*i);
      if(infoDetalle.descuento<100.00){
        doc.text(infoDetalle.descuento.toFixed(2).toString(),182.5,55+5*1.5*i);
      }else{
        doc.text(infoDetalle.descuento.toFixed(2).toString(),181,55+5*1.5*i);

      }
      doc.addImage('./assets/imgs/check.png','PNG',14,(51+5*1.5*i),4,4);
    }
    //IMPORTE TOTAL
    doc.text('IMPORTE TOTAL',135, 60+5*1.5*detalle.detalle.length);
    doc.text('IMPORTE TOTAL',135.1, 60+5*1.5*detalle.detalle.length);
    
    doc.text(detalle.montopago,180, 60+5*1.5*detalle.detalle.length);
    doc.text(detalle.montopago,180.1, 60+5*1.5*detalle.detalle.length);
    //TEXTO DE LA FECHA
    doc.text(this.transformFecha(detalle.detalle[0].fechapago),15, 70+5*1.5*detalle.detalle.length+10);
    doc.text(this.transformFecha(detalle.detalle[0].fechapago),15.1, 70+5*1.5*detalle.detalle.length+10);
    doc.text(this.transformFecha(detalle.detalle[0].fechapago),15.2, 70+5*1.5*detalle.detalle.length+10);

    //LINEA
    doc.addImage('./assets/imgs/lineahorizontal.png','PNG',126,70+5*1.5*detalle.detalle.length+15,
    75,7);


    if(detalle.apellido.length+detalle.nombre.length > 30){

      doc.text(((detalle.apellido+" "+detalle.nombre).substring(0,30)),136, 70+5*1.5*detalle.detalle.length+25)
      doc.text(((detalle.apellido+" "+detalle.nombre).substring(0,30)),136.1, 70+5*1.5*detalle.detalle.length+25)
      doc.text(((detalle.apellido+" "+detalle.nombre).substring(0,30)),136.2, 70+5*1.5*detalle.detalle.length+25)

      doc.text(((detalle.apellido+" "+detalle.nombre).substring(30,detalle.apellido.length+detalle.nombre.length+1)),136, 70+5*1.5*detalle.detalle.length+30)
      doc.text(((detalle.apellido+" "+detalle.nombre).substring(30,detalle.apellido.length+detalle.nombre.length+1)),136.1, 70+5*1.5*detalle.detalle.length+30)
      doc.text(((detalle.apellido+" "+detalle.nombre).substring(30,detalle.apellido.length+detalle.nombre.length+1)),136.2, 70+5*1.5*detalle.detalle.length+30)
    
    }else{
      doc.text((detalle.apellido+" "+detalle.nombre),136, 70+5*1.5*detalle.detalle.length+25)
    doc.text((detalle.apellido+" "+detalle.nombre),136.1, 70+5*1.5*detalle.detalle.length+25)
    doc.text((detalle.apellido+" "+detalle.nombre),136.2, 70+5*1.5*detalle.detalle.length+25)
    }


    



    


    //CIMA chiquito
    doc.addImage('./assets/imgs/cimachiquito.png','PNG',10,70+5*1.5*detalle.detalle.length+35,22,10);


    doc.addImage('./assets/imgs/footer.png','PNG',0,247,210,50);

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

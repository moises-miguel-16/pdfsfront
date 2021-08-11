import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import { token } from "../detalle/SEGOEUI-normal"

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.scss']
})
export class ModalDetalleComponent implements OnInit {
  @Input()Elemento:any;
  @Input()Descripcion:any;
  @Input()MontoPago:any;


  public descargando:boolean = false;
  public apellidoNombre = '';

  constructor( private modalActive:NgbActiveModal ) { }
  close(){
    this.modalActive.close('OK')
  }
  ngOnInit(): void {
    this.apellidoNombre =  this.Elemento.apellido+" "+this.Elemento.nombre


    let coords = document.getElementsByClassName('modal-content')[0].getBoundingClientRect();

  }

  descargarUnico(){
    this.descargarDetalle(this.Elemento);
 

    // this.descargarDetalle(this.detalles[0]);
    // this.descargarDetalle(this.detalles[21]);
    // this.descargarDetalle(this.detalles[2]);
  }
  descargarDetalle( detalle:any ){
    this.descargando = true;
    let doc = new jsPDF();
    console.log(detalle);
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

    //DNI_Adelanto[Mes].[Año].pdf

    doc.addImage('./assets/imgs/footer.png','PNG',0,247,210,50);

    let extension = this.extraerMesAnioCorchete(detalle.detalle[0].fechapago)+'.pdf'
    // let apellidoN = detalle.apellido.split(' ')[0]+detalle.apellido.split(' ')[1]+detalle.nombre.substring(0,1);
    let dni = detalle.login

    doc.save(`${dni}_Adelanto${extension}`);
    this.descargando = false;
    this.modalActive.close('descargo');
    
  }
  extraerMesAnioCorchete( fecha:any ){
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

    return mes+"."+anio;
  }


  transformFecha( fecha:any ):any{
    let arrayfecha = fecha.split('-');
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

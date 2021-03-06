import Swal from 'sweetalert2';
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
  public id: any;

  public mostrarPaginacion = true;
  public descripcion: any;
  public detalles = [];
  public numpages = 0;
  public pages: any[] = [];
  public detallesParciales:any[] = [];
  public detallesPorBusqueda:any[] = [];
  public busqueda = '';
  public descargando: any = '';
  public pageSelected: any;
  public detallesAux:any;

  constructor(route: ActivatedRoute, public tablaService: TablaService, private modalService: NgbModal,
  ) {
    this.id = route.snapshot.params.id;

    this.descripcion = route.snapshot.params.descripcion;
  }

  ngOnInit(): void {
    
      this.inicioTodo()
  }

  inicioTodo(){
    this.tablaService.cargarInfoTablaDetallada(this.id).subscribe((data: any) => {
      this.detalles = data;
      this.detallesAux = this.detalles
      this.numpages = this.detalles.length / 10;
      for (let index = 0; index < this.numpages; index++) {
        this.pages[index] = index + 1;

      }
      this.mostrarParcial(1);

    });
  }

  buscar(palabra: string) {

    this.mostrarPaginacion = false;
    this.detallesPorBusqueda = [];

    if (palabra.length > 0) {
      this.detalles.forEach((pal: any) => {

        //CADA CASO ES UNA UNION
        let union1 = pal.nombre.toLowerCase()+pal.apellido.toLowerCase()+pal.cargo.toLowerCase()
        let union2 = pal.nombre.toLowerCase()+pal.cargo.toLowerCase()+pal.apellido.toLowerCase()
        let union3 = pal.cargo.toLowerCase()+pal.nombre.toLowerCase()+pal.apellido.toLowerCase()
        let union4 = pal.cargo.toLowerCase()+pal.apellido.toLowerCase()+pal.nombre.toLowerCase()
        let union5 = pal.apellido.toLowerCase()+pal.cargo.toLowerCase()+pal.nombre.toLowerCase()
        let union6 = pal.apellido.toLowerCase()+pal.nombre.toLowerCase()+pal.cargo.toLowerCase()

      

        if (pal.nombre.toLowerCase().includes(palabra.toLowerCase()) ||
         pal.apellido.toLowerCase().includes(palabra.toLowerCase()) ||
         pal.cargo.toLowerCase().includes(palabra.toLowerCase())  ||

         //UNION POR CADA CASO
         union1.includes(palabra.toLowerCase().replace(/\s+/g, '')) ||
         union2.includes(palabra.toLowerCase().replace(/\s+/g, '')) ||
         union3.includes(palabra.toLowerCase().replace(/\s+/g, '')) ||
         union4.includes(palabra.toLowerCase().replace(/\s+/g, '')) ||
         union5.includes(palabra.toLowerCase().replace(/\s+/g, '')) ||
         union6.includes(palabra.toLowerCase().replace(/\s+/g, '')) 
        
         ) {
           console.log(union1)
          this.detallesPorBusqueda.push(pal)
        }
      })
      this.detallesParciales = this.detallesPorBusqueda;

      this.numpages = this.detallesParciales.length / 10;
      if(this.numpages<1) this.numpages = 1
      this.pages = []
      for (let index = 0; index < this.numpages; index++) {
        this.pages[index] = index + 1;

      }
      this.mostrarParcialBusqueda(1);

    }else{
      this.mostrarPaginacion = true
      this.inicioTodo();
    }

    
  }

  mostrarParcialBusqueda(page:number){
    this.pageSelected = page;
    this.detallesParciales = this.detallesPorBusqueda.slice(page * 10 - 10, page * 10)
  }

  mostrarParcial(page: number) {
    this.pageSelected = page;
    this.detallesParciales = this.detalles.slice(page * 10 - 10, page * 10)
  }



  public async abrirModal(elemento: any) {
    let modalRef;

    try {
      modalRef = this.modalService.open(ModalDetalleComponent, {
        centered: false,
        size: 'lg',

      });
      modalRef.componentInstance.Elemento = elemento;
      modalRef.componentInstance.Descripcion = this.descripcion
      modalRef.componentInstance.MontoPago = elemento.montopago

      let res = await modalRef.result;
      if (res == 'descargo') {
        Swal.fire('Descarga satisfactoria', 'El documento se descarg?? satisfactoriamente', 'success');
      }

    } catch (err) {
      console.log('ERROR')
    }




  }
  descargar() {

    Swal.fire({
      title: '??Seguro que desea descargar todos los archivos?',
      text: "Accion irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#337ab7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'S??, descargar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      let contador = 0;
      if (result.isConfirmed) {

        if(this.detallesPorBusqueda.length == 0){

          var interval = setInterval(() => {
            contador++;
            this.descargando = 'Descargando ' + (contador) + ' de ' + this.detalles.length + '.....'
            this.descargarDetalle(this.detalles[contador - 1]);
            if (contador === this.detalles.length) {
              clearInterval(interval)
              Swal.fire('Descarga satisfactoria', 'Los documentos se descargaron satisfactoriamente', 'success');
              this.descargando = ''
            }
          }, 300)
        }else{
          var interval = setInterval(() => {
            contador++;
            this.descargando = 'Descargando ' + (contador) + ' de ' + this.detallesPorBusqueda.length + '.....'
            this.descargarDetalle(this.detallesPorBusqueda[contador - 1]);
            if (contador === this.detallesPorBusqueda.length) {
              clearInterval(interval)
              Swal.fire('Descarga satisfactoria', 'Los documentos se descargaron satisfactoriamente', 'success');
              this.descargando = ''
            }
          }, 300)
        }


      
      }
    })

  }
  public regresar() {
    history.go(-1)
  }
  descargarDetalle(detalle: any) {

    let doc = new jsPDF();
    doc.setFontSize(10);
    doc.addFileToVFS('SEGOEUI-normal.ttf', token)
    doc.addFont('SEGOEUI-normal.ttf', 'SEGOEUI', 'normal');

    doc.setFillColor(255, 255, 200);
    doc.rect(15, 11, 73, 10, 'F');

    doc.setFontSize(13);
    doc.text(detalle.planilla, 15.8, 18);
    doc.text(detalle.planilla, 15.9, 18);
    doc.text(detalle.planilla, 16, 18);
    doc.setFontSize(10);
    doc.setFillColor(128, 229, 255);
    doc.rect(15, 25, 40, 7, 'F');

    doc.text('DETALLE', 15.8, 29.8);
    doc.text('DETALLE', 15.9, 29.9);


    doc.addImage('./assets/imgs/barraizquierda.png', 'PNG', 10, 10, 2, 25);
    doc.addImage('./assets/imgs/insignia.png', 'PNG', 175, 10, 25, 25);

    //TEXTO DE LOS ITEMS
    for (let i = 0; i < detalle.detalle.length; i++) {
      let infoDetalle = detalle.detalle[i];

      if (infoDetalle.descripcion.length > 58) {
        doc.setFont("SEGOEUI", "normal")
        doc.text(infoDetalle.descripcion.substring(0, 58), 20, 55 + 5 * 1.5 * i);
        doc.setFont("SEGOEUI", "normal")
        doc.text(infoDetalle.descripcion.substring(58, infoDetalle.descripcion.length), 20, 55 + 5 * 1.5 * i + 4);

      } else {
        doc.setFont("SEGOEUI", "normal")
        doc.text(infoDetalle.descripcion, 20, 55 + 5 * 1.5 * i);
      }
      // doc.setFont("SEGOEUI","normal")
      // doc.text(infoDetalle.descripcion,20,55+5*2*i);
      if (infoDetalle.descuento < 100.00) {
        doc.text(infoDetalle.descuento.toFixed(2).toString(), 182.5, 55 + 5 * 1.5 * i);
      } else {
        doc.text(infoDetalle.descuento.toFixed(2).toString(), 181, 55 + 5 * 1.5 * i);

      }
      doc.addImage('./assets/imgs/check.png', 'PNG', 14, (51 + 5 * 1.5 * i), 4, 4);
    }
    //IMPORTE TOTAL
    doc.text('IMPORTE TOTAL', 135, 60 + 5 * 1.5 * detalle.detalle.length);
    doc.text('IMPORTE TOTAL', 135.1, 60 + 5 * 1.5 * detalle.detalle.length);

    doc.text(detalle.montopago, 180, 60 + 5 * 1.5 * detalle.detalle.length);
    doc.text(detalle.montopago, 180.1, 60 + 5 * 1.5 * detalle.detalle.length);
    //TEXTO DE LA FECHA
    doc.text(this.transformFecha(detalle.detalle[0].fechapago), 15, 70 + 5 * 1.5 * detalle.detalle.length + 10);
    doc.text(this.transformFecha(detalle.detalle[0].fechapago), 15.1, 70 + 5 * 1.5 * detalle.detalle.length + 10);
    doc.text(this.transformFecha(detalle.detalle[0].fechapago), 15.2, 70 + 5 * 1.5 * detalle.detalle.length + 10);

    //LINEA
    doc.addImage('./assets/imgs/lineahorizontal.png', 'PNG', 126, 70 + 5 * 1.5 * detalle.detalle.length + 15,
      75, 7);


    if (detalle.apellido.length + detalle.nombre.length > 30) {

      doc.text(((detalle.apellido + " " + detalle.nombre).substring(0, 30)), 136, 70 + 5 * 1.5 * detalle.detalle.length + 25)
      doc.text(((detalle.apellido + " " + detalle.nombre).substring(0, 30)), 136.1, 70 + 5 * 1.5 * detalle.detalle.length + 25)
      doc.text(((detalle.apellido + " " + detalle.nombre).substring(0, 30)), 136.2, 70 + 5 * 1.5 * detalle.detalle.length + 25)

      doc.text(((detalle.apellido + " " + detalle.nombre).substring(30, detalle.apellido.length + detalle.nombre.length + 1)), 136, 70 + 5 * 1.5 * detalle.detalle.length + 30)
      doc.text(((detalle.apellido + " " + detalle.nombre).substring(30, detalle.apellido.length + detalle.nombre.length + 1)), 136.1, 70 + 5 * 1.5 * detalle.detalle.length + 30)
      doc.text(((detalle.apellido + " " + detalle.nombre).substring(30, detalle.apellido.length + detalle.nombre.length + 1)), 136.2, 70 + 5 * 1.5 * detalle.detalle.length + 30)

    } else {
      doc.text((detalle.apellido + " " + detalle.nombre), 136, 70 + 5 * 1.5 * detalle.detalle.length + 25)
      doc.text((detalle.apellido + " " + detalle.nombre), 136.1, 70 + 5 * 1.5 * detalle.detalle.length + 25)
      doc.text((detalle.apellido + " " + detalle.nombre), 136.2, 70 + 5 * 1.5 * detalle.detalle.length + 25)
    }









    //CIMA chiquito
    doc.addImage('./assets/imgs/cimachiquito.png', 'PNG', 10, 70 + 5 * 1.5 * detalle.detalle.length + 35, 22, 10);

    //DNI_Adelanto[Mes].[A??o].pdf

    doc.addImage('./assets/imgs/footer.png', 'PNG', 0, 247, 210, 50);

    let extension = this.extraerMesAnioCorchete(detalle.detalle[0].fechapago) + '.pdf'
    // let apellidoN = detalle.apellido.split(' ')[0]+detalle.apellido.split(' ')[1]+detalle.nombre.substring(0,1);
    let dni = detalle.login


    doc.save(`${dni}_Adelanto${extension}`);



  }
  extraerMesAnioCorchete(fecha: any) {
    let arrayfecha = fecha.split('-');
    let anio = arrayfecha[0];
    let mes = arrayfecha[1];
    let dia = arrayfecha[2];

    

    return mes + "." + anio;
  }


  transformFecha(fecha: any): any {
    let arrayfecha = fecha.split('-');
    let anio = arrayfecha[0];
    let mes = arrayfecha[1];
    let dia = arrayfecha[2];

    switch (mes) {
      case "01": mes = 'ENERO'; break;
      case "02": mes = 'FEBRERO'; break;
      case "03": mes = 'MARZO'; break;
      case "04": mes = 'ABRIL'; break;
      case "05": mes = 'MAYO'; break;
      case "06": mes = 'JUNIO'; break;
      case "07": mes = 'JULIO'; break;
      case "08": mes = 'AGOSTO'; break;
      case "09": mes = 'SETIEMBRE'; break;
      case "10": mes = 'OCTUBRE'; break;
      case "11": mes = 'NOVIEMBRE'; break;
      case "12": mes = 'DICIEMBRE'; break;
    }

    return dia + " DE " + mes + " DEL " + anio;

  }

}

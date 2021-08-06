import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  constructor( private http: HttpClient ) { }


  cargarInfoTabla(fechaInicio:any,fechaFin:any){
    // const url = `${ base_url }/entrada/${fechaInicio}/${fechaFin}`;
    let formData = new FormData();
    formData.append('caso', '6');
    formData.append('desde', fechaInicio);
    formData.append('hasta', fechaFin);
    const url = `http://intranet.colegiocima.edu.pe/v4cima/controlador/load_contabilidad.php`
    return this.http.post(url,{ body: formData,method: 'post' });

  }

  cargarInfoTablaDetallada( id:any,fechaInicio:any,fechaFin:any ){
    // const url = `${ base_url }/entrada/${id}/${fechaInicio}/${fechaFin}`;
    const url = `https://intranet.colegiocima.edu.pe:8443/api/cimapersonal/personal/remuneracion/${id}?caso=6
    &desde=${fechaInicio}&hasta=${fechaFin}`;
    return this.http.get(url);

  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  constructor( private http: HttpClient ) { }


  cargarInfoTabla(){
    const url = `${ base_url }/entrada`;
    return this.http.post(url,{});

  }

  cargarInfoTablaDetallada( id:any ){
    const url = `${ base_url }/entrada/${id}`;
    return this.http.get(url);

  }


}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.scss']
})
export class ModalDetalleComponent implements OnInit {
  @Input()Elemento:any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.Elemento)
  }

}

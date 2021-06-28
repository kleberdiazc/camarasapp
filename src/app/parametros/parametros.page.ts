import { ParametrosService } from './parametros.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.page.html',
  styleUrls: ['./parametros.page.scss'],
})
export class ParametrosPage implements OnInit {
  oculta: boolean = true;
  resumen: boolean = true;
  inventario: boolean = true;
  constructor(private _param:ParametrosService) { }

  ngOnInit() {
  }

  ResumenChange() {
    console.log(this.resumen);
  }

  ocultaChange() {
    console.log(this.oculta);
  }


  inventarioChange() {
    console.log(this.inventario);
  }

  Grabar() {
    this._param.ingresar("", "", "");
  }

}

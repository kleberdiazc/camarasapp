import { SaldosService } from './saldos.service';
import { Component, OnInit } from '@angular/core';
import { Saldos } from '../interfaces/interfaces';


@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.page.html',
  styleUrls: ['./saldos.page.scss']
})
export class SaldosPage implements OnInit {
  rows:Saldos[] = [];
  columns = [];
  constructor(private _saldos:SaldosService) {
    this.columns = [
      { prop: 'BODEGA',name: 'BODEGA'},
      { prop: 'Ubica', name:'Ubica' },
      { prop: 'PRODUCTO', name: 'PRODUCTO' },
      { prop: 'TALLA', name: 'TALLA' },
      { prop: 'LOTE', name: 'LOTE' },
      { prop: 'CJS', name: 'CJS' },
      { prop: 'MSTRS', name: 'MSTRS' },
    ]
  }


  ngOnInit() {
  }
 
  Buscar_Saldos() {
    console.log('click');
    this._saldos.getListaSaldos('5009', -1, '').subscribe((resp) => {
      console.log(resp);
      this.rows = resp;
      //this.temp = [...resp];
      console.log(this.rows);
      
    }); 
  }

}

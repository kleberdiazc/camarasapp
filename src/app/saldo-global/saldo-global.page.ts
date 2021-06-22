import { SaldoGlobalService } from './saldo-global.service';
import { Component, OnInit } from '@angular/core';
import { SaldosGlobal } from '../interfaces/interfaces';

@Component({
  selector: 'app-saldo-global',
  templateUrl: './saldo-global.page.html',
  styleUrls: ['./saldo-global.page.scss'],
})
export class SaldoGlobalPage implements OnInit {
  rows:SaldosGlobal[] = [];
  columns = [];
  total: number = 0;
  constructor(private _saldoGolbal:SaldoGlobalService) {
    
    this.columns = [
      { prop: 'CODIGO',name: 'CODIGO'},
      { prop: 'DESCRIPCION', name:'DESCRIPCION' },
      { prop: 'MASTER', name: 'MASTER' },
      { prop: 'LIBRAS', name: 'LIBRAS' },
    ]

  }

  ngOnInit() {
  }

  Buscar_Saldos() {
    console.log('click');
    this._saldoGolbal.getListaSaldosGlobal('','').subscribe((resp) => {
      console.log(resp);
      this.rows = resp;
      //this.temp = [...resp];
      console.log(this.rows);
      let suma = 0;
      this.rows.forEach(element => {
        suma = suma + element.MASTER
      });

      console.log(suma);
      this.total = suma;
      
    }); 
  }
}

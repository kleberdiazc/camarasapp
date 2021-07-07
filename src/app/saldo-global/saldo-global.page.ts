import { SaldoGlobalService } from './saldo-global.service';
import { Component, OnInit } from '@angular/core';
import { SaldosGlobal } from '../interfaces/interfaces';
import { SelectionType } from '@swimlane/ngx-datatable';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-saldo-global',
  templateUrl: './saldo-global.page.html',
  styleUrls: ['./saldo-global.page.scss'],
})
export class SaldoGlobalPage implements OnInit {
  rows: SaldosGlobal[] = [];
  rows2: SaldosGlobal[] = [];
  rows3:SaldosGlobal[] = [];
  columns = [];
  total: number = 0;
  selected = [];
  selected2 = [];
  selected3 = [];
  SelectionType = SelectionType;
  principal:boolean= false;
  segundo:boolean=true;
  tercero: boolean = true;
  loading: any = this.loadingController.create();
  constructor(private _saldoGolbal: SaldoGlobalService,
              private alertController: AlertController,
              public loadingController: LoadingController) {
    
    this.columns = [
      { prop: 'CODIGO',name: 'CODIGO'},
      { prop: 'DESCRIPCION', name:'DESCRIPCION' },
      { prop: 'MASTER', name: 'MASTER' },
      { prop: 'LIBRAS', name: 'LIBRAS' },
    ]

  }

  ngOnInit() {
    //this.Buscar_Saldos();
  }

  

  Buscar_Saldos() {
    console.log('click');
    this.loading = this.presentLoading('Cargando');
    this._saldoGolbal.getListaSaldosGlobal('','').subscribe((resp) => {
      this.loading.dismiss();
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
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
  }


  siguiente() {
    this.tercero = true;
    this.segundo = false;
    this.principal = true;
    console.log(this.selected[0]["CODIGO"]);
    
    console.log('click');
    this.loading = this.presentLoading('Cargando');
    this._saldoGolbal.getListaSaldosGlobal(this.selected[0]["CODIGO"], '').subscribe((resp) => {
      this.loading.dismiss();
      console.log(resp);
      this.rows2 = resp;
      //this.temp = [...resp];
      console.log(this.rows2);
      /*let suma = 0;
      this.rows.forEach(element => {
        suma = suma + element.MASTER
      });

      console.log(suma);
      this.total = suma;*/
      
    }); 
  }

  atrasPrimero() {
    this.tercero = true;
    this.segundo = true;
    this.principal = false;
  }

  tercero2() {
    this.tercero = false;
    this.segundo = true;
    this.principal = true;
    console.log("select2",this.selected2);
    
    console.log('click');
    this.loading = this.presentLoading('Cargando');
    this._saldoGolbal.getListaSaldosGlobal('', this.selected2[0]["BOD_CODIGO"]).subscribe((resp) => {
      this.loading.dismiss();
      console.log(resp);
      this.rows3 = resp;
      //this.temp = [...resp];
      console.log(this.rows3);
      /*let suma = 0;
      this.rows.forEach(element => {
        suma = suma + element.MASTER
      });

      console.log(suma);
      this.total = suma;*/
      
    }); 
  }

  atrasSegundo() {
    this.tercero = true;
    this.segundo = false;
    this.principal = true;
  }
}

import { SaldosService } from './saldos.service';
import { Component, OnInit } from '@angular/core';
import { Saldos } from '../interfaces/interfaces';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.page.html',
  styleUrls: ['./saldos.page.scss']
})
export class SaldosPage implements OnInit {
  rows:Saldos[] = [];
  columns = [];
  loading: any = this.loadingController.create();
  constructor(private _saldos: SaldosService,
              private alertController: AlertController,
              public loadingController: LoadingController,) {
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
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
  }

  ngOnInit() {
  }
 
  Buscar_Saldos() {
    console.log('click');
    this.loading = this.presentLoading('Cargando');
    this._saldos.getListaSaldos('5009', -1, '').subscribe((resp) => {
      this.loading.dismiss();
      console.log(resp);
      this.rows = resp;
      //this.temp = [...resp];
      console.log(this.rows);
      
    }); 
  }

}

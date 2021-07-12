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
  rows: Saldos[] = [];
  columns = [];
  loading: any = this.loadingController.create();

  async presentAlert(Header, Mensaje) {

    this.hideLoading();
    let css = (Header === "Error" ? "variant-alert-error" : Header === "Advertencia" ? "variant-alert-warning" : "variant-alert-success");
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: css,
        header: Header,
        message: Mensaje,
        buttons: [{
          text: 'OK',
          handler: () => {
            return resolve(true);
          },
        }]
      });

      await alert.present();
    });
  }

  async presentAlertConfirm(mensaje) {
    this.hideLoading();
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'Confirmar',
        message: mensaje,
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'SI',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }

  async showLoading(mensaje) {

    return new Promise(async (resolve) => {
      this.loading = await this.loadingController.create({
        message: mensaje,
        translucent: true,
        cssClass: 'custom-class custom-loading',
      });
      await this.loading.present();
      return resolve(true);
    });
  }

  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }


  constructor(private _saldos: SaldosService,
    private alertController: AlertController,
    public loadingController: LoadingController,) {
    this.columns = [
      { prop: 'BODEGA', name: 'BODEGA' },
      { prop: 'Ubica', name: 'Ubica' },
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
    this.loading = this.showLoading('Cargando');
    this._saldos.getListaSaldos('5009', -1, '').subscribe((resp) => {
      this.loading.dismiss();
      console.log(resp);
      this.rows = resp;
      //this.temp = [...resp];
      console.log(this.rows);

    });
  }

}

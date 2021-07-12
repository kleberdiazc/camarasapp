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
  rows3: SaldosGlobal[] = [];
  columns = [];
  total: number = 0;
  selected = [];
  selected2 = [];
  selected3 = [];
  SelectionType = SelectionType;
  principal: boolean = false;
  segundo: boolean = true;
  tercero: boolean = true;
  loading: any = this.loadingController.create();
  codigo: string = '';
  bodega: string = '';

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

  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }

  constructor(private _saldoGolbal: SaldoGlobalService,
    private alertController: AlertController,
    public loadingController: LoadingController) {

    this.columns = [
      { prop: 'CODIGO', name: 'CODIGO' },
      { prop: 'DESCRIPCION', name: 'DESCRIPCION' },
      { prop: 'MASTER', name: 'MASTER' },
      { prop: 'LIBRAS', name: 'LIBRAS' },
    ]

  }

  ngOnInit() {
    //this.Buscar_Saldos();
  }

  ionViewDidEnter() {
    this.rows = [];
    this.codigo = '';
    this.bodega = '';
    this.rows2 = [];
    this.rows3 = [];
    this.total = 0.0;
  }

  async Buscar_Saldos() {
    //console.log('click');
    //this.loading = this.presentLoading('Cargando');

    await this.showLoading("Cargando Saldos...");
    await this.saldos();
    this.hideLoading();
  }

  async saldos() {
    const valor = await new Promise(async (resolve) => {
      this._saldoGolbal.getListaSaldosGlobal('', '').subscribe(async (resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.rows = JSON.parse(JSON.stringify(resp.Dt.Table));

            let suma = 0;
            this.rows.forEach(element => {
              suma = suma + element.MASTER
            });

            this.total = suma;
          }
        } else {
          await this.presentAlert("Error", resp.Description);
        }

        return resolve(true);
      });

    });
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return this.loading.present();
  }


  async onSelect(e) {

    this.codigo = this.selected[0]["CODIGO"];
    //console.log(this.selected[0].tran.toString());
  }

  async onSelectvw2(e) {
    this.bodega = this.selected2[0]["BOD_CODIGO"];
  }

  async siguiente() {
    this.tercero = true;
    this.segundo = false;
    this.principal = true;
    await this.showLoading("Cargando...");
    await this.getlistaSaldo();
    this.hideLoading();

  }

  async getlistaSaldo() {
    const valor = await new Promise(async (resolve) => {
      this._saldoGolbal.getListaSaldosGlobal(this.selected[0]["CODIGO"], '').subscribe(async (resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.rows2 = JSON.parse(JSON.stringify(resp.Dt.Table));
          }
        } else {
          await this.presentAlert("Error", resp.Description);
        }

        return resolve(true);
      });
    });
  }

  atrasPrimero() {
    this.tercero = true;
    this.segundo = true;
    this.principal = false;
  }

  async tercero2() {
    this.tercero = false;
    this.segundo = true;
    this.principal = true;
    await this.showLoading("Cargando...");
    await this.getlista3();
    this.hideLoading();

  }
  async getlista3() {
    const valor = await new Promise(async (resolve) => {
      this._saldoGolbal.getListaSaldosGlobal('', this.selected2[0]["BOD_CODIGO"]).subscribe(async (resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.rows3 = JSON.parse(JSON.stringify(resp.Dt.Table));
          }
        } else {
          await this.presentAlert("Error", resp.Description);
        }

        return resolve(true);
      });

    });
  }

  atrasSegundo() {
    this.tercero = true;
    this.segundo = false;
    this.principal = true;
  }
}

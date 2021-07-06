import { ParametrosService } from './parametros.service';
import { Component, OnInit } from '@angular/core';
import { ConsultaSsccService } from '../consulta-sscc/consulta-sscc.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.page.html',
  styleUrls: ['./parametros.page.scss'],
})
export class ParametrosPage implements OnInit {
  oculta: boolean = false;
  resumen: boolean = false;
  inventario: boolean = false;
  bluetoothList: any = [];
  mac: string = "";
  MyDefaultMacValue: string;
  loading: any = null;

  constructor(private _param: ParametrosService,
    private print: ConsultaSsccService,
    private alertController: AlertController,
    public loadingController: LoadingController) { }

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

  async presentAlert(Header, Mensaje) {
    this.hideLoading();
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
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

  async ngOnInit() {
    await this.showLoading("Cargando..");

    await this.listBTDevice();
    /* console.log("BRING DATA",) */

    /* const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Un momento...',
      duration: 4000
    });
    await loading.present(); */

    /* const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!'); */

    this.inventario = (await this._param.getvaluesInventario() == 'true');
    this.oculta = (await this._param.getvaluesOculta() == 'true');
    this.resumen = (await this._param.getvaluesResumido() == 'true');
    this.mac = await this._param.getvaluesMac();
    this.MyDefaultMacValue = this.mac;
    //console.log('MAC', this.mac);
    //this.mac = this._param.getvaluesMac();

    this.hideLoading();

  }


  async Grabar() {

    this._param.ingresar(this.mac, this.resumen, this.oculta, this.inventario);
    let mno = await this.alertController.create({
      header: "Sucess " + "Guardado con Exito",
      buttons: ['Ok']
    });
    await mno.present();

  }


  async listBTDevice() {
    const valor = await new Promise(async (resolve) => {
      this.print.searchBt().then(datalist => {
        this.bluetoothList = datalist;

      }, async err => {
        this.presentAlert("ERROR", err);

      });
      return resolve(true);
    });
  }

}

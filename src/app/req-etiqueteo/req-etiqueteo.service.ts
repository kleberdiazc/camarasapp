import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { ResultWS } from './../interfaces/interfaces';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { URL_CONSULT, URL_TRANSACIMAGEN } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class ReqEtiqueteoService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private btSerial: BluetoothSerial
    , private alertCtrl: AlertController) { }


  connectBT(address) {
    return this.btSerial.connect(address);
  }

  async printer(dataPrint, address) {
    return new Promise(async (resolve) => {
      let xyz = await this.connectBT(address).subscribe(async data => {
        if (data === "OK") {
          await this.btSerial.write(dataPrint).then(async dataz => {
            xyz.unsubscribe();
            return resolve(true);
          }, async errx => {
            xyz.unsubscribe();
            let mno = await this.alertCtrl.create({
              header: "Error Impresión ",
              message: errx,
              buttons: ['OK']
            });
            await mno.present();

            return resolve(false);
          });
        }
      }, async err => {
        let mno = await this.alertCtrl.create({
          header: "Error Conexión ",
          message: err,
          buttons: ['OK']
        });
        await mno.present();
        return resolve(false);
      });
    });
  }

  getDataInitial(planta, user) {
    const ListParam = [{ "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    { "Name": "USER", "Type": "Varchar", "Value": user }];

    const base = {
      sp: 'SP_CARGA_BODEGAORIGEN_SOB',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getDataSSCC(sscc, planta, user) {
    const ListParam = [{ "Name": "SSCC", "Type": "VarChar", "Value": sscc },
    { "Name": "PLANTA", "Type": "VarChar", "Value": planta },
    { "Name": "USER", "Type": "VarChar", "Value": user }];

    const base = {
      sp: 'SP_SSCC_REQETIQUETEO',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }


  GrabaMovimiento(xml, user, bodori) {
    const ListParam = [{ "Name": "XML", "Type": "Xml", "Value": xml },
    { "Name": "USER", "Type": "VarChar", "Value": user },
    { "Name": "BODORI", "Type": "VarChar", "Value": bodori }];

    const base = {
      sp: 'SP_GRABATRANSACC_ETIQ_CO',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };


    var formdata = new FormData();
    formdata.append("param", JSON.stringify(base));
    formdata.append("paramImagen", "{}");

    console.log("Grabando 2");

    return this.http.post<ResultWS>(URL_TRANSACIMAGEN, formdata);
  }

}

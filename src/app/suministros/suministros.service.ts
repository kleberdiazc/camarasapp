import { URL_CONSULT } from './../config/url.servicios';
import { RWDetalleCons } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { RWCombosCons } from '../interfaces/interfaces';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Injectable({
  providedIn: 'root'
})
export class SuministrosService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private btSerial: BluetoothSerial) { }
  
  
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
              let mno = await this.alertController.create({
                header: "Error Impresión ",
                message: errx,
                buttons: ['OK']
              });
              await mno.present();
  
              return resolve(false);
            });
          }
        }, async err => {
          let mno = await this.alertController.create({
            header: "Error Conexión ",
            message: err,
            buttons: ['OK']
          });
          await mno.present();
          return resolve(false);
        });
      });
    }
  ConsultarDatos(planta:string,user:string) {
    console.log(planta);
    const ListParam = [{ "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    { "Name": "USER", "Type": "Varchar", "Value": user },
    ];
    
    const base = {
      sp: 'SP_CARGA_DATATRANS_SUM',
      param: ListParam,
      conexion: 'PRODUCCION'
    };
    
    return this.http.post<RWCombosCons>('http://web.songa.com/songaapi/api/Consult', base);
  }


  ConsultarTransac(sello: string, item: string, cantidad: string, origen: string,
    destino: string, planta: string, usuario: string) {
    
    let cant: string = cantidad.toString();
    let items: string = item.toString();

    console.log(sello, item, cant, origen,
      destino, planta, usuario);
    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": "T" },
    { "Name": "SELLO", "Type": "Varchar", "Value": sello },
    { "Name": "ITEM", "Type": "Varchar", "Value": items },
    { "Name": "CANTIDAD", "Type": "Varchar", "Value": cant },
    { "Name": "BODORI", "Type": "Varchar", "Value": origen },
    { "Name": "BODDES", "Type": "Varchar", "Value": destino },
    { "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    { "Name": "USER", "Type": "Varchar", "Value": usuario }
    ];
    const base = {
      sp: 'SP_GRABA_TRANS_SUM',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };
    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }


  Imprimir(sello:string,tipo:string) {
    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": "T" },
    { "Name": "SELLO", "Type": "Varchar", "Value": sello },
    ];
    const base = {
      sp: 'sp_transSuminImpr',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };
    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }

}

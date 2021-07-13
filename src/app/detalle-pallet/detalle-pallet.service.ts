import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { URL_CONSULT, CONNECTION_PROD } from '../config/url.servicios';
import { Valida, RWDetalleCons, RWCombosCons } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DetallePalletService {


  constructor(private http: HttpClient,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private btSerial: BluetoothSerial
  ) { }

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
  ConsultarDetallePallet(sscc: string) {

    const ListParam = [{ "Name": "codigo", "Type": "Varchar", "Value": sscc }
    ];

    const base = {
      sp: 'SPR_DetPallet_ionic',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    console.log(sscc)
    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }

  DetalleTransac(NUMTRA: string) {
    let numero: string = '' + NUMTRA + ''

    const ListParam = [{ "Name": "tran", "Type": "NVarchar", "Value": numero },
    ];
    const base = {
      sp: 'spr_dettrans',
      param: ListParam,
      conexion: CONNECTION_PROD
    };



    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }

  getTransac(NUMTRA: string) {
    let numero: string = '' + NUMTRA + ''

    const ListParam = [{ "Name": "pallet", "Type": "Varchar", "Value": numero },
    ];
    const base = {
      sp: 'sp_gettransac',
      param: ListParam,
      conexion: CONNECTION_PROD
    };



    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }

  imprimir2(pallet, rows) {
    let cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
      'TONE 0' + '\n' +
      'SPEED 5' + '\n' +
      'PAGE-WIDTH 560' + '\n' +
      'PAGE-HEIGHT 800' + '\n' +
      'BAR-SENSE' + '\n' +
      ';// PAGE 0000000005600800' + '\n' +
      'T 7 0 150 115                 ' + pallet + '\n' + '\n' +
      'T 7 0 22 135                                          ' + '\n'

    let salto = 170
    let talla: string;
    let TotCaj: string;
    let Totmas: number = 0;
    let descripcion: string;
    let datoAnt: string = '';
    let primera: boolean = true;

    rows.forEach(element => {
      if (salto >= 750) {
        cadena = cadena + 'BT OFF' + '\n' +
          'BT 0 1 0' + '\n' +
          'BT OFF' + '\n' +
          'PRINT' + '\n'
        cadena = cadena + '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
          'TONE 0' + '\n' +
          'SPEED 5' + '\n' +
          'PAGE-WIDTH 560' + '\n' +
          'PAGE-HEIGHT 800' + '\n' +
          'BAR-SENSE' + '\n' +
          ';// PAGE 0000000005600800' + '\n' +
          'T 7 0 22 135' + '\n'
        salto = 170;
      }
      talla = element.Talla;
      descripcion = element.Description;
      //falta subtring 20
      descripcion = descripcion + '                   ';
      descripcion = descripcion.substring(0, 20);
      descripcion = descripcion + ' ' + talla;

      if (datoAnt != descripcion) {
        cadena = (cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + '\n' +
          'T 7 0 290 ' + salto + ' ' + Totmas + '\n');

        Totmas = 0;
        salto += 30;
      }
      datoAnt = descripcion;
      cadena = cadena + 'T 7 0 25 ' + salto + ' ' + '' + '\n';
      primera = false;
      salto += 30;


    });
    cadena = cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + '\n' +
      'T 7 0 445 ' + salto + ' ' + Totmas + '\n';
    primera = false;
    Totmas = 0;

    cadena = cadena + 'BT OFF' + '\n' +
      'BT 0 1 0' + '\n' +
      'BT OFF' + '\n' +
      'PRINT' + '\n'

    //aqui se debe imprimir
    return cadena;


  }


  imprimir(pallet, rows) {
    let cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
      'TONE 0' + '\n' +
      'SPEED 5' + '\n' +
      'PAGE-HWIDT 560' + '\n' +
      'BAR-SENSE' + '\n' +
      ';// PAGE 0000000005600800' + '\n' +
      'T 7 0 22 135                                          ' + '\n'

    let salto = 170
    let talla: string;
    let TotCaj: string;
    let Totmas: number = 0;
    let descripcion: string;
    let datoAnt: string = '';
    let primera: boolean = true;

    rows.forEach(element => {
      console.log(element);

      let descripcion;
      if (salto >= 700) {
        cadena = cadena + 'BT OFF' + '\n' +
          'BT 0 1 0' + '\n' +
          'BT OFF' + '\n' +
          'PRINT' + '\n';

        cadena = cadena + ' 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
          'TONE 0' + '\n' +
          'SPEED 5' + '\n' +
          'PAGE-HWIDT 560' + '\n' +
          'BAR-SENSE' + '\n' +
          ';// PAGE 0000000005600800' + '\n' +
          'T 7 0 22 135                                          ' + '\n';
        salto = 170;
      }


      talla = element.Talla;

      descripcion = element.Descri;
      //falta subtring 20
      descripcion = descripcion + '                   ';
      descripcion = descripcion.substring(0, 20);
      descripcion = descripcion + ' ' + talla;

      if (datoAnt != descripcion) {
        if (primera = false) {
          cadena = (cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + '\n' +
            'T 7 0 445 ' + salto + ' ' + Totmas + '\n');
          primera = false;
          Totmas = 0;
          salto += 30;
        }
        datoAnt = descripcion;
        cadena = cadena + 'T 7 0 25 ' + salto + '' + '' + '\n';
        salto += 30;
      }
      cadena = cadena + 'T 0 2 290 ' + salto + ' ' + element.Lote + '\n' +
        'T 0 2 445 ' + salto + ' ' + element.Master + '\n';
      Totmas += Number(element.Master);
      salto += 30



    });
    cadena = cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + '\n' +
      'T 7 0 445 ' + salto + ' ' + Totmas + '\n';
    primera = false;
    Totmas = 0;

    cadena = cadena + 'BT OFF' + '\n' +
      'BT 0 1 0' + '\n' +
      'BT OFF' + '\n' +
      'PRINT' + '\n'

    //aqui se debe imprimir
    return cadena;



  }


}

import { RWDetalleCons } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { SaldosGlobal, Valida } from '../interfaces/interfaces';
import { ParametrosService } from '../parametros/parametros.service';
import { URL_CONSULT } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class DetalleConsultaService {
  fechaMovil = "";
  horaMovil = "";
  formaPallet = "";
  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private _param: ParametrosService,) { }


  ValidarConsulta(consulta: string, sscc: string) {

    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": consulta },
    { "Name": "SSCC", "Type": "Varchar", "Value": sscc }
    ];

    const base = {
      sp: 'SP_CONSULTA_GEN',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post<Valida>(URL_CONSULT, base);
  }


  ConsultarDetalle(resumido: string, sscc: string) {

    const ListParam = [{ "Name": "codigo", "Type": "Varchar", "Value": sscc },
    { "Name": "resumido", "Type": "Varchar", "Value": resumido }
    ];

    const base = {
      sp: 'spr_ConsultarDetallenew',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    console.log(resumido, sscc)
    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }



  SaldosTallas(codigo, lote, talla, planta) {
    console.log(codigo, lote, talla, planta);
    let tal = talla.toString();
    const ListParam = [{ "Name": "bit_produc", "Type": "Varchar", "Value": codigo },
    { "Name": "bit_lote", "Type": "Varchar", "Value": lote },
    { "Name": "bit_codtal", "Type": "Varchar", "Value": tal },
    { "Name": "bit_planta", "Type": "Varchar", "Value": planta }
    ];

    const base = {
      sp: 'spr_SaldosxProdTallote',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }

  imprimirpall(sscc) {


    this.obtieneFechaHora().subscribe((resp) => {
      let fecha = [];
      fecha = resp.Dt.Table;
      this.fechaMovil = fecha[0]["fecha"];
      this.horaMovil = fecha[0]["hora"];
      this.formaPallet = fecha[0]["FechaFormatPallet"];
    });

    this.consultaCajas(sscc).subscribe(async (resp) => {
      if (resp.Codigo.toString() == 'false') {
        const alert = await this.alertController.create({
          header: 'Error!',
          message: resp.Description,
          buttons: ['OK']
        });
        await alert.present();

      } else {
        if (resp.Dt.Table.length = 0) {
          const alert = await this.alertController.create({
            header: 'Error!',
            message: 'No existen el codigo SSCC',
            buttons: ['OK']
          });
          await alert.present();
        } else {
          let inventario = (await this._param.getvaluesInventario() == 'true');
          let oculta = (await this._param.getvaluesOculta() == 'true');
          let resumen = (await this._param.getvaluesResumido() == 'true');
          let mac = this._param.getvaluesMac();
          let prod = resp.Dt.Table; //OBTENER EL DATO PROD
          let cadena;
          if (oculta = true) {
            cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
              'TONE 0' + '\n' + 'PEED 5' + '\n'
            'PAGE-WIDTH 560' + '\n' +
              'GAP-SENSE' + '\n' +
              '// PAGE 0000000005600800' + '\n' +
              'T90 7 1 35 625 ' + '\n' +
              'T90 0 2 100 586 ' + '\n' +
              'T90 7 0 138 495 ' + '\n' + this.formaPallet + "\n" +
              '90 7 1 204 555 (00)' + '\n' + sscc + '\n'
            'BT 0 3 0' + '\n' +
              'VB 128 2 0 200 288 625 00' + '\n' + sscc + "\n" +
              'BT OFF' + '\n' +
              'BOX 188 215 258 520 1' + '\n' +
              'BT OFF' + '\n' +
              'PRINT' + '\n'
          }
          else {

            cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
              'TONE 0' + '\n' +
              'SPEED 5' + '\n' +
              'PAGE-WIDTH 560' + '\n' +
              'GAP-SENSE' + '\n' +
              ';// PAGE 0000000005600800' + '\n' +
              'T90 7 1 204 555 (00)' + sscc + '\n' +
              'BT 0 3 0' + '\n' +
              'VB 128 2 0 200 288 625 00' + sscc + '\n' +
              'BT OFF' + '\n' +
              'BOX 188 215 258 520 1' + '\n' +
              'BT OFF' + '\n' + "PRINT" + '\n'
          }


        }

      }
    });


  }

  imprimime1(sscc) {
    let strSubtitulo;
    let strSubtitulo2;

    this.obtieneFechaHora().subscribe((resp) => {
      let fecha = [];
      fecha = resp.Dt.Table;
      this.fechaMovil = fecha[0]["fecha"];
      this.horaMovil = fecha[0]["hora"];
      this.formaPallet = fecha[0]["FechaFormatPallet"];
    });

    if (sscc.substring(2, 10) == '3786115923' || sscc.substring(2, 10) == '3786120673') {
      strSubtitulo = '';
      strSubtitulo2 = '';
    } else if (sscc.substring(2, 10) == '3786115922' || sscc.substring(2, 10) == '3786120672') {
      strSubtitulo = '';
      strSubtitulo2 = '';
    }

    this.consultaCajas(sscc).subscribe(async (resp) => {
      if (resp.Codigo.toString() == 'false') {
        const alert = await this.alertController.create({
          header: 'Error!',
          message: resp.Description,
          buttons: ['OK']
        });
        await alert.present();

      } else {
        if (resp.Dt.Table.length = 0) {
          const alert = await this.alertController.create({
            header: 'Error!',
            message: 'No existen el codigo SSCC',
            buttons: ['OK']
          });
          await alert.present();
        } else {
          let inventario = (await this._param.getvaluesInventario() == 'true');
          let oculta = (await this._param.getvaluesOculta() == 'true');
          let resumen = (await this._param.getvaluesResumido() == 'true');
          let mac = this._param.getvaluesMac();
          let prod = resp.Dt.Table; //OBTENER EL DATO PROD
          let cadena;
          if (oculta = true) {
            if (inventario = true) {
              cadena = '! 0 200 200 800 1' + '\n' + "LABEL" + '\n' + "CONTRAST 0" + '\n' +
                'TONE 0' + '\n' +
                'SPEED 5' + '\n' +
                'PAGE-WIDTH 560' + '\n' +
                'BAR-SENSE' + '\n' +
                ';// PAGE 0000000005600800' + '\n' +
                'T 7 1 65 14 ' + '\n' +
                'T 0 2 104 57 ' + '\n' +
                'T 7 0 184 84 ' + '\n' +
                'T 7 0 194 115 Detalle ' + sscc + '\n' + '\n' +
                'T 7 0 22 135 Cód  Talla Descripción         Lote  Total' + '\n'
            }
            else {

              cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
                'TONE 0' + '\n' +
                'SPEED 5' + '\n' +
                'PAGE-WIDTH 560' + '\n' +
                'BAR-SENSE' + '\n' +
                ';// PAGE 0000000005600800' + '\n' +
                'T 7 1 65 14 ' + '\n' +
                'T 0 2 104 57 ' + '\n' +
                'T 7 0 184 84 ' + '\n' +
                'T 7 0 194 115         ' + sscc + '\n' + '\n' +
                'T 7 0 22 135                                             ' + '\n'
            }

          } else {
            if (inventario = true) {
              cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + "CONTRAST 0" + '\n' +
                'TONE 0' + '\n' +
                'SPEED 5' + '\n' +
                'PAGE-WIDTH 560' + '\n' +
                'BAR-SENSE' + '\n' +
                ';// PAGE 0000000005600800' + '\n' +
                'T 7 0 194 115 Detalle ' + sscc + '\n' + '\n' +
                'T 7 0 22 135 Cód  Talla Descripción         Lote  Total' + '\n'
            } else {
              cadena = '! 0 200 200 800 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
                'TONE 0' + '\n' +
                'SPEED 5' + '\n' +
                'PAGE-WIDTH 560' + '\n' +
                'BAR-SENSE' + '\n' +
                ';// PAGE 0000000005600800' + '\n' +
                'T 7 1 194 115 ' + sscc + '\n' + '\n' +
                'T 7 0 22 135                                           ' + '\n'
            }
          }



        }

      }
    });


  }

  consultaCajas(sscc) {
    const ListParam = [{ "Name": "sscc", "Type": "Varchar", "Value": sscc }
    ];

    const base = {
      sp: 'sp_consultacajas',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }

  obtieneFechaHora() {
    const ListParam = [
    ];

    const base = {
      sp: 'Spr_FechaMoviles',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }
}

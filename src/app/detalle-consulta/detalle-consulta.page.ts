import { subscribeOn } from 'rxjs/operators';
import { DetalleConsultaService } from './detalle-consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SaldosGlobal } from '../interfaces/interfaces';
import { AlertController, LoadingController } from '@ionic/angular';
import { ParametrosService } from '../parametros/parametros.service';

@Component({
  selector: 'app-detalle-consulta',
  templateUrl: './detalle-consulta.page.html',
  styleUrls: ['./detalle-consulta.page.scss'],
})
export class DetalleConsultaPage implements OnInit {
  rows = [];
  saldos = [];
  columns = [];
  total: number = 0;
  sscc: string;
  resumido: boolean;
  consulta: string;
  data: any;
  tipo: string = "CAJA"
  codigo: string;
  talla: string;
  Descri: string;
  Lote: string;
  Total: string;
  Pallet: string
  saldo: string;
  bodega: string;
  totalcant: string;
  copias: string = "2";
  primero = false;
  segundo = true;
  tal_codigo: string;
  loading: any = this.loadingController.create();

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

  constructor(private route: ActivatedRoute,
    private router: Router, private _detalle: DetalleConsultaService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private _param: ParametrosService) {
    this.columns = [
      { prop: 'Cod', name: 'Cod' },
      { prop: 'Talla', name: 'Talla' },
      { prop: 'Descri', name: 'Descri' },
      { prop: 'Lote', name: 'Lote' },
      { prop: 'Master', name: 'Master' },
      { prop: 'sscc_Bodega', name: 'Bodega' },
      { prop: 'LIBRAS', name: 'LIBRAS' },
    ]
    if (this.router.getCurrentNavigation().extras.state != undefined) {
      console.log(this.router.getCurrentNavigation().extras.state.sscc)
      this.data = this.router.getCurrentNavigation().extras.state;
      if (this.data.sscc.substring(1, 9) == '786115922' || this.data.sscc.substring(1, 9) == '786120672') {
        this.tipo = "CAJA"
      }
      if (this.data.sscc.substring(1, 9) == '786115923' || this.data.sscc.substring(1, 9) == '786120673') {
        this.tipo = "MASTER"
      }

    }
  }

  async ngOnInit() {

    //this.loading = await this.showLoading('Cargando');
    await this.showLoading("Cargando..");
    let resum;
    if (this.data === undefined) {
      this.hideLoading();
      return;
    }

    if (this.data.resumido) {
      resum = 'S';
    } else {
      resum = 'N';
    }
    const valor = await new Promise(async (resolve) => {
      this._detalle.ConsultarDetalle(resum, this.data.sscc).subscribe((resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            let dt: [][] = resp.Dt.Table;
            if (resp.Dt.Table.length > 0) {
              this.rows = resp.Dt.Table;
            }
            else {
              this.presentAlert("Información", dt[0]["INFO"].toString());
              return resolve(true);
            }
          }
        } else {
          this.presentAlert("Error", resp.Description);
          return resolve(true);
        }

        return resolve(true);
      });
    });
    this.hideLoading();
  }


  onClickRow(row) {
    console.log('mi row', row.Lote);
    this.codigo = row.Cod;
    this.talla = row.Talla;
    this.Descri = row.Descri;
    this.Lote = row.Lote;
    this.Total = row.Master;
    this.saldo = row.Saldo;
    this.bodega = row.sscc_Bodega;
    this.totalcant = row.Master;
    this.tal_codigo = row.tal_codigo

  }

  async onImprimeBarra() {
    let fechaMovil;
    let horaMovil;
    let formaPallet;
    let sscc = this.router.getCurrentNavigation().extras.state.sscc;

    if (this.Pallet == '') {
      sscc = this.Pallet;
    } else {
      sscc = this.data.sscc;
    }

    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;
      this._detalle.obtieneFechaHora().subscribe((resp) => {
        let fecha = [];
        fecha = resp.Dt.Table;
        fechaMovil = fecha[0]["fecha"];
        horaMovil = fecha[0]["hora"];
        formaPallet = fecha[0]["FechaFormatPallet"];
      });

      this._detalle.consultaCajas(sscc).subscribe(async (resp) => {
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
            let oculta = (await this._param.getvaluesOculta() == 'true');
            let prod = resp.Dt.Table; //OBTENER EL DATO PROD
            let cadena;
            if (oculta = true) {
              cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) + 'PEED 5' + String.fromCharCode(13) + String.fromCharCode(10)
              'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                'GAP-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                '// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                'T90 7 1 35 625 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                'T90 0 2 100 586 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                'T90 7 0 138 495 ' + String.fromCharCode(13) + String.fromCharCode(10) + formaPallet + "\n" +
                '90 7 1 204 555 (00)' + String.fromCharCode(13) + String.fromCharCode(10) + sscc + String.fromCharCode(13) + String.fromCharCode(10)
              'BT 0 3 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'VB 128 2 0 200 288 625 00' + String.fromCharCode(13) + String.fromCharCode(10) + sscc + "\n" +
                'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BOX 188 215 258 520 1' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'PRINT' + String.fromCharCode(13) + String.fromCharCode(10)
            }
            else {

              cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                'GAP-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                'T90 7 1 204 555 (00)' + sscc + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT 0 3 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'VB 128 2 0 200 288 625 00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BOX 188 215 258 520 1' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) + "PRINT" + String.fromCharCode(13) + String.fromCharCode(10)
            }

            console.log(cadena);
            rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
            if (rsPrint) {
              await this.presentAlert("Información", "Impresión realizada");
            }


          }

        }
      })

    } catch (error) {
      await this.presentAlert("Error", error);
    }
    this.hideLoading();




  }



  imprime() {

  }

  imprime2() {

  }

  async onPopUp() {
    this.loading = await this.showLoading('Cargando');
    this.primero = true;
    this.segundo = false;
    this._detalle.SaldosTallas(this.codigo, this.Lote, this.tal_codigo, '1').subscribe((resp) => {
      if (resp.Codigo) {
        if (Object.keys(resp.Dt).length > 0) {
          this.saldos = JSON.parse(JSON.stringify(resp.Dt.Table));
        }
      } else {
        this.presentAlert("Error", resp.Description);
      }
      this.hideLoading();
    });
    this.hideLoading();
  }
  salir() {
    this.primero = false;
    this.segundo = true;
  }

  Transf() {

  }
}

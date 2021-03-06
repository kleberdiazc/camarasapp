import { LoginservicesService } from './../login/loginservices.service';
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
  tipo: string = "Total"
  codigo: string;
  talla: string;
  Descri: string;
  Lote: string;
  Total: string;
  Pallet: string
  saldo: string;
  bodega: string;
  totalcant: string = "0";
  copias: string = "2";
  primero = false;
  segundo = true;
  tal_codigo: string;
  loading: any = this.loadingController.create();
  matric = false;
  muestraImp = false;

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
    private _param: ParametrosService,
    private _login: LoginservicesService) {
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
      /*if (this.data.sscc.substring(1, 9) == '786115922' || this.data.sscc.substring(1, 9) == '786120672') {
        this.tipo = "CAJA"
      }
      if (this.data.sscc.substring(1, 9) == '786115923' || this.data.sscc.substring(1, 9) == '786120673') {
        this.tipo = "MASTER"
      }*/
      //this.GetTIPO();

    }
  }

  async ngOnInit() {
    let inv = (await this._param.getvaluesInventario() == 'true');
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

    if (inv) {
      this.muestraImp = false;
    } else {
      this.muestraImp = true;
    }

    const valor = await new Promise(async (resolve) => {
      this._detalle.ConsultarDetalle(resum, this.data.sscc).subscribe((resp) => {
        if (resp.Codigo) {
          console.log("ok");
          if (Object.keys(resp.Dt).length > 0) {
            let dt: [][] = resp.Dt.Table;
            if (resp.Dt.Table.length > 0) {
              this.rows = resp.Dt.Table;
              for (let ii = 0; ii < this.rows.length; ii++) {
                this.totalcant = (Number(this.totalcant) + Number(this.rows[ii]["Master"])).toString();

              }
              this.cargaPrimero(this.rows[0]);
            }
            else {
              this.presentAlert("Informaci??n", dt[0]["INFO"].toString());
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
    //this.hideLoading();

    if (this.data.sscc != '') {
      await this.GetCodigoPadre();
    }
    //await this.showLoading("Cargando..");
    await this.GetTIPO();
    //this.hideLoading();
    //await this.GetTIPO();

    this.hideLoading();
  }

  async GetTIPO() {
    const valor = await new Promise(async (resolve) => {
      this._detalle.getTipoSSCC(this.data.sscc).subscribe((resp) => {

        if (resp.Codigo) {


          if (Object.keys(resp.Dt).length > 0) {

            if (resp.Dt.Table.length > 0) {
              let dt: [][] = resp.Dt.Table;
              let det = dt[0]["Clase"];
              switch (det) {
                case 'C':
                  this.tipo = 'Cajas';
                  break;
                case 'M':
                  this.tipo = 'Cajas ';
                  break;
                case 'P':
                  this.tipo = 'Masters';
                  break;
                default:
                  break;
              }
            }

            else {
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


  }

  async GetCodigoPadre() {
    console.log('padre');
    //await this.showLoading("Cargando..");
    const valor = await new Promise(async (resolve) => {
      this._detalle.ConsultarPadre(this.data.sscc).subscribe((resp) => {

        if (resp.Codigo) {


          if (Object.keys(resp.Dt).length > 0) {

            if (resp.Dt.Table.length > 0) {
              let dt: [][] = resp.Dt.Table;
              this.Pallet = dt[0]["dsscc_sscc"];
              console.log('tabla pallet', dt[0]["dsscc_sscc"]);
            }
            else {
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
    //this.hideLoading();
  }

  cargaPrimero(row) {
    this.codigo = row.Cod;
    this.talla = row.Talla;
    this.Descri = row.Descri;
    this.Lote = row.Lote;
    this.Total = row.Master;
    this.saldo = row.Saldo;
    this.bodega = row.Ubica + ' ' + row.sscc_Bodega;
    //this.totalcant = row.Master;
    this.tal_codigo = row.tal_codigo
  }
  onClickRow(row) {


    this.codigo = row.Cod;
    this.talla = row.Talla;
    this.Descri = row.Descri;
    this.Lote = row.Lote;
    this.Total = row.Master;
    this.saldo = row.Saldo;
    this.bodega = row.sscc_Bodega;
    //this.totalcant = row.Master;
    this.tal_codigo = row.tal_codigo

  }

  async onImprimeBarra() {
    let fechaMovil;
    let horaMovil;
    let formaPallet;
    let sscc = this.data.sscc;

    if (this.Pallet == '') {
      sscc = this.Pallet;
    } else {
      sscc = this.data.sscc;
    }

    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;

      const v1 = await new Promise(async (resolve) => {
        this._detalle.obtieneFechaHora().subscribe((resp) => {
          let fecha = [];
          fecha = resp.Dt.Table;
          fechaMovil = fecha[0]["fecha"];
          horaMovil = fecha[0]["hora"];
          formaPallet = fecha[0]["FechaFormatPallet"];
          return resolve(true);
        });
      });

      const v2 = await new Promise(async (resolve) => {
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
              if (oculta) {
                cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) + 'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'GAP-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                  '// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'T90 7 1 35 625 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'T90 0 2 100 586 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'T90 7 0 138 495 ' + formaPallet + String.fromCharCode(13) + String.fromCharCode(10) +
                  '90 7 1 204 555 (00)' + sscc + String.fromCharCode(13) + String.fromCharCode(10) +
                  'BT 0 3 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'VB 128 2 0 200 288 625 00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) +
                  'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'BOX 188 215 258 520 1' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);
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
                  'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                  'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);
              }

              console.log('esta es la cadena Pallet', cadena);
              rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
              if (rsPrint) {
                await this.presentAlert("Informaci??n", "Impresi??n realizada");
              }


            }

          }
          return resolve(true);
        })

      });

      this.hideLoading();
    } catch (error) {
      await this.presentAlert("Error", error);
      this.hideLoading();
    }





  }



  async imprime() {
    let sscc = this.data.sscc;
    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;
      const v2 = await new Promise(async (resolve) => {
        this._detalle.consultaCajas(sscc).subscribe(async (resp) => {
          if (resp.Codigo.toString() == 'false') {
            await this.presentAlert("Error", resp.Description);

          } else {
            if (resp.Dt.Table.length = 0) {

              await this.presentAlert("Error", "No existen el codigo SSCC");
            } else {
              let oculta = (await this._param.getvaluesOculta() == 'true');
              let inventario = (await this._param.getvaluesInventario() == 'true');
              let resumen = (await this._param.getvaluesResumido() == 'true');
              let mac = await this._param.getvaluesMac();
              let prod = resp.Dt.Table; //OBTENER EL DATO PROD
              let cadena = '';
              let strSubtitulo = '';

              if (this.data.sscc.substring(2, 10) == '3786115923' || this.data.sscc.substring(2, 10) == '3786120673') {
                strSubtitulo = '';
              }
              if (this.data.sscc.substring(2, 10) == '3786120673' || this.data.sscc.substring(2, 10) == '3786120672') {
                strSubtitulo = '';
              }

              if (oculta) {
                if (inventario) {
                  cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 65 14 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 104 57 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 184 84 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 194 115 Detalle 00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135 C??d  Talla Descripci??n         Lote  Total' + String.fromCharCode(13) + String.fromCharCode(10);
                } else {
                  cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 65 14 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 104 57 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 184 84 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 194 115         00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135                                             ' + String.fromCharCode(13) + String.fromCharCode(10);
                }

              } else {
                if (inventario) {
                  cadena = cadena + ' 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 194 115 Detalle 00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135 C??d  Talla Descripci??n         Lote  Total' + String.fromCharCode(13) + String.fromCharCode(10);
                } else {
                  cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 194 115  00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135                                           ' + String.fromCharCode(13) + String.fromCharCode(10);
                }
              }
              let Salto = 170
              let talla: string;
              let TotCaj: string;
              let Totmas: number = 0;
              let descripcion: string = '';
              let datoAnt: string = '';
              let primera: boolean = true;
              let Dbltotal = 0;

              this.rows.forEach(element => {


                descripcion = element.Descri;
                descripcion = descripcion + '                   ';
                descripcion = descripcion.substring(0, 20);
                //descripcion = descripcion + ' ' + talla;

                if (inventario) {
                  cadena = cadena + 'T 0 2 25 ' + Salto + ' ' + element.Cod + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 80 ' + Salto + ' ' + element.Talla + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 150 ' + Salto + ' ' + descripcion + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 390 ' + Salto + ' ' + element.Lote + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 480 ' + Salto + ' ' + element.Master + String.fromCharCode(13) + String.fromCharCode(10);
                }
                else {
                  cadena = cadena + 'T 0 2 25 ' + Salto + ' ' + element.Cod + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 80 ' + Salto + ' ' + element.Talla + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 150 ' + Salto + ' ' + '' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 390 ' + Salto + ' ' + element.Lote + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 480 ' + Salto + ' ' + element.Master + String.fromCharCode(13) + String.fromCharCode(10);

                }
                Dbltotal += element.Master;
                Salto += 30;

              });

              cadena = cadena + 'T 7 2 390 ' + Salto + '        ' + strSubtitulo + ' ' + Dbltotal.toString() + String.fromCharCode(13) + String.fromCharCode(10);
              Salto += 30;
              cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);

              console.log('esta es la cadena Impime1', cadena);
              for (let index = 0; index < Number(this.copias); index++) {
                rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
              }

              if (rsPrint) {
                await this.presentAlert("Informaci??n", "Impresi??n realizada");
              }

            }

          }
          return resolve(true);
        });

      });


    } catch (error) {
      await this.presentAlert("Error", error);
    }
    this.hideLoading();

  }

  async imprime2() {
    let sscc = this.data.sscc;
    let user = await this._login.getuser();
    if (this.matric) {
      await this.showLoading("Imprimiendo..");
      await this.agregarColaPallet(sscc, user);
      await this.presentAlert("Informaci??n", "Enviada a la cola de Impresi??n");
      this.hideLoading();
      return;
    }


    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;
      const v2 = await new Promise(async (resolve) => {
        this._detalle.consultaCajas(sscc).subscribe(async (resp) => {
          if (resp.Codigo.toString() == 'false') {

            await this.presentAlert("Error", resp.Description);
          } else {
            if (resp.Dt.Table.length = 0) {

              await this.presentAlert("Error", "No existen el codigo SSCC");
            } else {
              let oculta = (await this._param.getvaluesOculta() == 'true');
              let inventario = (await this._param.getvaluesInventario() == 'true');
              let resumen = (await this._param.getvaluesResumido() == 'true');
              let mac = await this._param.getvaluesMac();
              let prod = resp.Dt.Table; //OBTENER EL DATO PROD
              let cadena = '';
              let strSubtitulo;
              let DatoAnt;

              if (oculta) {
                if (inventario) {
                  cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + "CONTRAST 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 65 14 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 104 57 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 184 84 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 150 115 Detalle Pallet 00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135 Producto              lote          Mstr' + String.fromCharCode(13) + String.fromCharCode(10);
                } else {
                  cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + "LABEL" + String.fromCharCode(13) + String.fromCharCode(10) + "CONTRAST 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 65 14 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 0 2 104 57 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 184 84 ' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 150 115  ' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135                                           ' + String.fromCharCode(13) + String.fromCharCode(10);
                }

              } else {
                if (inventario) {
                  cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 150 115 Detalle Pallet 00' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135 Producto              lote          Mstr' + String.fromCharCode(13) + String.fromCharCode(10);
                } else {
                  cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                    ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 1 194 115  ' + sscc + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
                    'T 7 0 22 135                                           ' + String.fromCharCode(13) + String.fromCharCode(10);
                }
              }
              let Salto = 170
              let talla: string;
              let TotCaj: string;
              let Totmas: number = 0;
              let descripcion: string;
              let datoAnt: string = '';
              let primera: boolean = true;
              let Dbltotal = 0;



              this.rows.forEach(async element => {



                if (Salto >= 750) {
                  cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                    'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);
                  // retorno no entiendo que hace aqui 
                  rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
                  /*if (rsPrint) {
                  await this.presentAlert("Informaci??n", "Impresi??n realizada");
                  }*/
                  cadena = '';

                  if (inventario) {
                    cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                      ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'T 7 0 22 135 Producto              lote          Mstr' + String.fromCharCode(13) + String.fromCharCode(10);
                  }
                  else {
                    cadena = cadena + ' 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
                      ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'T 7 0 22 135                                          ' + String.fromCharCode(13) + String.fromCharCode(10);
                  }
                  Salto = 170;
                }

                talla = element.Talla;
                descripcion = element.Descri;
                descripcion = descripcion + '                   ';
                descripcion = descripcion.substring(0, 20);
                descripcion = descripcion + ' ' + talla;
                if (DatoAnt = !descripcion) {
                  if (!primera) {
                    cadena = cadena + 'T 7 0 290 ' + Salto + '      ->' + String.fromCharCode(13) + String.fromCharCode(10) +
                      'T 7 0 445 ' + Salto + ' ' + Totmas + String.fromCharCode(13) + String.fromCharCode(10);

                    Totmas = 0;
                    Salto += 30;
                  }
                  DatoAnt = descripcion;
                  primera = false;
                  Salto += 30;

                }
                cadena = cadena + 'T 0 2 25 ' + Salto + ' ' + element.Cod + String.fromCharCode(13) + String.fromCharCode(10) +
                  'T 0 2 135 ' + Salto + ' ' + element.Talla + String.fromCharCode(13) + String.fromCharCode(10) +
                  'T 0 3 290 ' + Salto + ' ' + element.Lote + String.fromCharCode(13) + String.fromCharCode(10) +
                  'T 0 2 445 ' + Salto + ' ' + element.Master + String.fromCharCode(13) + String.fromCharCode(10);

                Totmas = Totmas + Number(element.Master);
                Salto += 30;
              });
              cadena = cadena + 'T 7 0 290 ' + Salto + '      ->' + String.fromCharCode(13) + String.fromCharCode(10) +
                'T 7 0 445 ' + Salto + ' ' + Totmas + String.fromCharCode(13) + String.fromCharCode(10);
              primera = false;
              Totmas = 0;

              cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
                'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
                'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);

              console.log('esta es la cadena Impime2', cadena);
              rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
              if (rsPrint) {
                await this.presentAlert("Informaci??n", "Impresi??n realizada");
                cadena = '';
              }

            }

          }
          return resolve(true);
        });

      });

    } catch (error) {
      await this.presentAlert("Error", error);
    }
    this.hideLoading();

  }

  async agregarColaPallet(sscc, usuario) {
    const valor = await new Promise(async (resolve) => {
      this._detalle.colaImpresionPallet(sscc, usuario).subscribe((resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            //this.embarques = resp.Dt.Table;
          }
        } else {
          this.presentAlert("Error", resp.Description);

        }
        return resolve(true);
      });
    });
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
  onMyBooleanChange() {
    console.log(this.matric);
  }
}

import { DetallePalletService } from './detalle-pallet.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DetalleConsultaService } from '../detalle-consulta/detalle-consulta.service';
import { ParametrosService } from '../parametros/parametros.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-detalle-pallet',
  templateUrl: './detalle-pallet.page.html',
  styleUrls: ['./detalle-pallet.page.scss'],
})
export class DetallePalletPage implements OnInit {
  columnMode: ColumnMode;
  validationsForm: FormGroup;
  isChecked: boolean;
  myBoolean = true;
  consulta: string;
  rows = [];
  columns = [];
  loading: any = this.loadingController.create();
  Descripcion = '';
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
  constructor(private router: Router,
    private alertController: AlertController,
    private _detalle: DetallePalletService,
    public loadingController: LoadingController,
    private _param: ParametrosService
  ) {

    this.columns = [
      { prop: 'Cod', name: 'Cod' },
      { prop: 'Talla', name: 'Talla' },
      { prop: 'Lote', name: 'Lote' },
      { prop: 'Master', name: 'Master' }
    ]


    this.validationsForm = new FormGroup({
      'sscc': new FormControl('', Validators.compose([
        //Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });


  }
  async presentLoading(mensaje: string) {
    this.hideLoading();
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return this.loading.present();
  }

  ngOnInit() {
    this.isChecked = true;
  }

  onSubmit(values) {

    this.consultarPallet();

  }


  async consultarPallet() {
    await this.showLoading("Cargando..");
    this.Descripcion = "";
    this.rows.length = 0;
    const valor0 = await new Promise(async (resolve) => {
      //debugger;
      if (this.validationsForm.get('sscc').value.length == 20) {
        //this.loading = this.presentLoading('Cargando');
        const valor = await new Promise(async (resolve) => {
          this._detalle.ConsultarDetallePallet(this.validationsForm.get('sscc').value.substring(2, 20)).subscribe(async (resp) => {

            if (resp.Codigo) {
              if (Object.keys(resp.Dt).length > 0) {
                let dt: [][] = resp.Dt.Table;
                if (resp.Dt.Table.length > 0) {
                  var ColumnData = [];
                  //debugger;
                  for (let x = 0; x < Object.entries(dt[0]).length; x += 1) {
                    ColumnData.push({
                      name: Object.entries(dt[0])[x][0].toString(),
                      prop: Object.entries(dt[0])[x][0].toString()
                      , width: (Object.entries(dt[0])[x][0].toString().toUpperCase() === "DESCRI" ? 250 : 80)
                    });
                  }
                  this.columns = JSON.parse(JSON.stringify(ColumnData));
                  this.rows = resp.Dt.Table;

                }
              }
            } else {
              this.presentAlert("Error", resp.Description);
            }
            return resolve(true);
          });
        });
        return resolve(true);
      }
      else {
        //this.loading = this.presentLoading('Cargando');
        const valor = await new Promise(async (resolve) => {
          this._detalle.DetalleTransac(this.validationsForm.get('sscc').value).subscribe(async (resp) => {

            if (resp.Codigo) {
              if (Object.keys(resp.Dt).length > 0) {
                let dt: [][] = resp.Dt.Table;
                if (resp.Dt.Table.length > 0) {

                  var ColumnData = [];
                  //debugger;
                  for (let x = 0; x < Object.entries(dt[0]).length; x += 1) {
                    ColumnData.push({
                      name: Object.entries(dt[0])[x][0].toString(),
                      prop: Object.entries(dt[0])[x][0].toString()
                      , width: (Object.entries(dt[0])[x][0].toString().toUpperCase() === "PRODUCTO" ? 250 : 80)
                    });
                  }
                  this.columns = JSON.parse(JSON.stringify(ColumnData));
                  this.rows = resp.Dt.Table;

                }
              }
              return resolve(true);
            } else {
              this.presentAlert("Error", resp.Description);
              return resolve(false);
            }
          });

        });

        if (!valor) {
          return resolve(true);
        }

        const valor2 = await new Promise(async (resolve) => {
          this._detalle.getTransac(this.validationsForm.get('sscc').value).subscribe(async (resp) => {

            if (resp.Codigo) {
              if (Object.keys(resp.Dt).length > 0) {
                let dt: [][] = resp.Dt.Table;
                if (resp.Dt.Table.length > 0) {
                  let detalle: [][] = resp.Dt.Table;
                  this.Descripcion = detalle[0]["Tipo"] + " " + detalle[0]["Resp"] + " " + detalle[0]["Bod1"]
                    + " " + detalle[0]["fecha"];

                }
              }
              return resolve(true);
            } else {
              this.presentAlert("Error", resp.Description);
              return resolve(true);
            }
          });
        });

        return resolve(true);

      }
    });

    this.hideLoading();
  }

  onKeydown(event) {
    console.log(event);
  }

  async onImprimir() {
    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;

      //let det = this._detalle.imprimir(this.validationsForm.get('sscc').value, this.rows);
      //console.log(det);
      let cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
        'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
        'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
        'PAGE-HWIDT 560' + String.fromCharCode(13) + String.fromCharCode(10) +
        'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
        ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
        'T 7 0 22 135                                          ' + String.fromCharCode(13) + String.fromCharCode(10);

      let salto = 170
      let talla: string;
      let TotCaj: string;
      let Totmas: number = 0;
      let descripcion: string;
      let datoAnt: string = '';
      let primera: boolean = true;

      this.rows.forEach(element => {
        console.log(element);

        let descripcion;
        if (salto >= 700) {
          cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
            'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
            'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
            'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);

          cadena = cadena + ' 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) + +
            'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
            'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
            'PAGE-HWIDT 560' + String.fromCharCode(13) + String.fromCharCode(10) +
            'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
            ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
            'T 7 0 22 135                                          ' + String.fromCharCode(13) + String.fromCharCode(10);
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
            cadena = (cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 7 0 445 ' + salto + ' ' + Totmas + String.fromCharCode(13) + String.fromCharCode(10));
            primera = false;
            Totmas = 0;
            salto += 30;
          }
          datoAnt = descripcion;
          cadena = cadena + 'T 7 0 25 ' + salto + '' + '' + String.fromCharCode(13) + String.fromCharCode(10);
          salto += 30;
        }
        cadena = cadena + 'T 0 2 290 ' + salto + ' ' + element.Lote + String.fromCharCode(13) + String.fromCharCode(10) +
          'T 0 2 445 ' + salto + ' ' + element.Master + String.fromCharCode(13) + String.fromCharCode(10);
        Totmas += Number(element.Master);
        salto += 30



      });
      cadena = cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + String.fromCharCode(13) + String.fromCharCode(10) +
        'T 7 0 445 ' + salto + ' ' + Totmas + String.fromCharCode(13) + String.fromCharCode(10);
      primera = false;
      Totmas = 0;

      cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
        'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
        'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
        'PRINT' + String.fromCharCode(13) + String.fromCharCode(10) +

        console.log(cadena);
      rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
      if (rsPrint) {
        await this.presentAlert("Información", "Impresión realizada");
      }

    } catch (error) {
      await this.presentAlert("Error", error);
    }
    this.hideLoading();
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
  async onImprimir2() {
    let pallet = this.validationsForm.get('sscc').value;
    // let det = this._detalle.imprimir2(this.validationsForm.get('sscc').value, this.rows);
    //console.log(det);
    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;
      //let det = this._detalle.imprimir(this.validationsForm.get('sscc').value, this.rows);
      //console.log(det);
      let cadena = '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10) + + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) + +
        ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'T 7 0 150 115                 ' + pallet + String.fromCharCode(13) + String.fromCharCode(10) + + String.fromCharCode(13) + String.fromCharCode(10) + +
        'T 7 0 22 135                                          ' + String.fromCharCode(13) + String.fromCharCode(10)

      let salto = 170
      let talla: string;
      let TotCaj: string;
      let Totmas: number = 0;
      let descripcion: string;
      let datoAnt: string = '';
      let primera: boolean = true;

      this.rows.forEach(element => {
        if (salto >= 750) {
          cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
            'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
            'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
            'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);
          cadena = cadena + '! 0 200 200 800 1' + String.fromCharCode(13) + String.fromCharCode(10)
            + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
            'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
            'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
            'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
            'PAGE-HEIGHT 800' + String.fromCharCode(13) + String.fromCharCode(10) +
            'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
            ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
            'T 7 0 22 135' + String.fromCharCode(13) + String.fromCharCode(10);
          salto = 170;
        }
        talla = element.Talla;
        descripcion = element.Description;
        //falta subtring 20
        descripcion = descripcion + '                   ';
        descripcion = descripcion.substring(0, 20);
        descripcion = descripcion + ' ' + talla;

        if (datoAnt != descripcion) {
          cadena = (cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + String.fromCharCode(13) + String.fromCharCode(10) +
            'T 7 0 290 ' + salto + ' ' + Totmas + String.fromCharCode(13) + String.fromCharCode(10));

          Totmas = 0;
          salto += 30;
        }
        datoAnt = descripcion;
        cadena = cadena + 'T 7 0 25 ' + salto + ' ' + '' + String.fromCharCode(13) + String.fromCharCode(10);
        primera = false;
        salto += 30;


      });
      cadena = cadena + 'T 7 0 290 ' + salto + ' ' + '      ->' + String.fromCharCode(13) + String.fromCharCode(10) + +
        'T 7 0 445 ' + salto + ' ' + Totmas + String.fromCharCode(13) + String.fromCharCode(10);
      primera = false;
      Totmas = 0;

      cadena = cadena + 'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
        'BT 0 1 0' + String.fromCharCode(13) + String.fromCharCode(10) +
        'BT OFF' + String.fromCharCode(13) + String.fromCharCode(10) +
        'PRINT' + String.fromCharCode(13) + String.fromCharCode(10) +

        console.log(cadena);
      rsPrint = await this._detalle.printer(cadena, await this._param.getvaluesMac());
      if (rsPrint) {
        await this.presentAlert("Información", "Impresión realizada");
      }
    } catch (error) {
      await this.presentAlert("Error", error);
    }
    this.hideLoading();
  }

}

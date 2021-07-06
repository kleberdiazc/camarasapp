import { Component, OnInit, ViewChild } from '@angular/core';
import { ReqEtiqueteoService } from './req-etiqueteo.service';
import { AlertController, LoadingController, IonInput } from '@ionic/angular';
import { ResultWS, DataCombos, TablaCodigo, ClsProducto, tb_DataGrid2 } from './../interfaces/interfaces';
import { LoginservicesService } from './../login/loginservices.service';
import { ParametrosService } from '../parametros/parametros.service';

@Component({
  selector: 'app-req-etiqueteo',
  templateUrl: './req-etiqueteo.page.html',
  styleUrls: ['./req-etiqueteo.page.scss'],
})
export class ReqEtiqueteoPage implements OnInit {
  @ViewChild('inputSSCC', { static: false }) inputSSCC: IonInput;

  dataCombosOrigen: DataCombos[] = [];
  cmbOrigen: string = "";
  txtScannedValue: string = "";
  DataGrid: tb_DataGrid2[] = [];
  tb_detalle: tb_DataGrid2[] = [];

  txtSSCC: string = "";
  loading: any = null;

  async presentAlert(Header, Mensaje) {
    /* const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: Header,
      message: Mensaje,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss(); */
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

  async showLoading(mensaje) {
    /* this.loading = this.loadingController.create({
      message: 'This Loader will Not AutoHide'
    }).then((res) => {
      res.present();
    }); */
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

  constructor(private _dataService: ReqEtiqueteoService, public alertController: AlertController,
    public loadingController: LoadingController, private _log: LoginservicesService
    , private _param: ParametrosService) {

  }

  async ngOnInit() {
    await this.showLoading("Cargando...");
    await this.loadData();
    this.hideLoading();
  }

  async loadData() {
    const valor = await new Promise(async (resolve) => {
      this._dataService.getDataInitial("1", await this._log.getuser()).subscribe((resp) => {

        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.dataCombosOrigen = resp.Dt.Table;

          }
        } else {
          this.presentAlert("Error", resp.Description);
        }
        return resolve(true);
      });
    });
  }

  async onEnterSSCC() {
    try {
      if ((this.txtScannedValue.length === 20 && this.txtScannedValue.substring(0, 1) !== "]") ||
        (this.txtScannedValue.length === 23 && this.txtScannedValue.substring(0, 1) === "]")) {
        if (this.txtScannedValue.length === 23) {
          this.txtSSCC = this.txtScannedValue.substring(5, this.txtScannedValue.length);
        } else {
          this.txtSSCC = this.txtScannedValue.substring(2, this.txtScannedValue.length);
        }
      } else {
        return;
      }

      if (this.cmbOrigen === null || this.cmbOrigen.trim() === "") {
        this.presentAlert("Advertencia", "Debe seleccionar una bodega origen");
        return;
      }


      const v1 = await new Promise(async (resolve) => {

        this._dataService.getDataSSCC(this.txtSSCC, "1", await this._log.getuser()).subscribe(async (resp) => {
          if (resp.Codigo) {

            if (Object.keys(resp.Dt).length > 0) {
              let dt: [][] = resp.Dt.Table;
              if (dt.length > 0) {
                if (this.tb_detalle.length > 0) {
                  for (let index = 0; index < this.tb_detalle.length; index++) {
                    if (this.tb_detalle[index].sscc.trim() === dt[0]["sscc"].toString().trim()) {
                      await this.presentAlert("Error", "Codigo repetido");
                      return resolve(false);
                    }

                  }
                }
              }

              let dt2: [][] = resp.Dt.Table1;
              let ar: tb_DataGrid2 = { "sscc": "", "Tipo": "" };
              let ar2: tb_DataGrid2 = { "sscc": "", "Tipo": "" };

              for (let x = 0; x < dt2.length; x++) {
                ar.sscc = dt2[x]["sscc"];
                this.tb_detalle.push(ar);
              }
              ar2.sscc = dt[0]["sscc"].toString().trim();
              ar2.Tipo = dt[0]["tipo"].toString().trim();
              this.DataGrid.push(ar2);
              this.DataGrid = JSON.parse(JSON.stringify(this.DataGrid));
            }
            return resolve(true);
          } else {
            await this.presentAlert("Error", resp.Description);
            return resolve(false);
          }
        });
      });

      if (!v1) {
        return;
      }


      this.txtScannedValue = "";
      setTimeout(() => this.inputSSCC.setFocus(), 300);
    } catch (error) {
      this.presentAlert("Error", error);
    }
  }
  async OnClickNuevo() {

    this.txtScannedValue = "";
    this.txtSSCC = "";
    this.cmbOrigen = "";
    this.tb_detalle.length = 0;
    this.DataGrid.length = 0;
  }

  async onClickGrabar() {
    await this.showLoading("Grabando...");
    try {
      if (this.cmbOrigen === null || this.cmbOrigen.trim() === "") {
        this.presentAlert("Advertencia", "Debe seleccionar una bodega origen");
        return;
      }

      if (this.DataGrid.length <= 0) {
        this.presentAlert("Advertencia", "Debe ingresar los codigos de pallet o masters a generar req.");
        return;
      }

      let xml = "";

      xml = "<Tabla>" + "\n"
      for (let index = 0; index < this.DataGrid.length; index++) {
        xml = xml + "<detalle>" + "\n"
        xml = xml + "<Tipo>" + this.DataGrid[index].Tipo.toString().trim() + "</Tipo>" + "\n"
        xml = xml + "<SSCC>" + this.DataGrid[index].sscc.toString().trim() + "</SSCC>" + "\n"
        xml = xml + "</detalle>" + "\n"
      }
      xml = xml + "</Tabla>";
      let dataPrint: [][];
      let dataSoli: string = "";
      const v1 = await new Promise(async (resolve) => {

        this._dataService.GrabaMovimiento(xml, await this._log.getuser(), this.cmbOrigen).subscribe(async (resp) => {

          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              for (let i = 0; i < Object.keys(resp.Dt).length; i++) {
                if (Object.keys(Object.values(resp.Dt)[i][0])[0].toString().trim() === "CodigosSolicitud") {
                  dataSoli = Object.values(resp.Dt)[i][0]["CodigosSolicitud"].toString().trim();
                }
                if (Object.keys(Object.values(resp.Dt)[i][0])[0].toString().trim() === "Solicitudes") {
                  dataPrint = Object.values(resp.Dt)[i];
                }
              }
              if (dataSoli.trim() !== "") {
                if (dataPrint !== null) {
                  this.ImprimirTicket(dataPrint);
                }
                await this.presentAlert("Información", "Solicitudes generadas: " + dataSoli);
              } else {
                await this.presentAlert("Información", "Transacción grabada con éxito");
              }
              this.OnClickNuevo();
            }
            return resolve(true);
          } else {
            await this.presentAlert("Error", resp.Description);
            return resolve(false);
          }
        });
      });
    } catch (error) {
      await this.presentAlert("Error", error);
    }
    this.hideLoading();
  }
  async ImprimirTicket(data) {
    try {
      let s: string = "";
      let v: string = "";
      let lotes: string = "";
      let i: number = 0;

      if (data !== null) {
        if (data.length > 0) {
          for (let x = 0; x < data.length; x++) {

            s = ""
            lotes = ""
            v = data[x]["Solicitudes"].toString().split(",");
            i = 0
            for (let index = 0; index < v.length; index++) {
              i = i + 1;
              if (index === 0) {
                i = 0;
                s = s + v[index].toString() + "/" + "\n";
              }
              else {
                s = s + v[index].toString() + "/";
                if (i % 3 === 0) {
                  s = s + "\n";
                }
              }
            }

            v = data[x]["LotesOld"].toString().split(",");
            i = 0
            for (let index = 0; index < v.length; index++) {
              i = i + 1;
              if (index === 0) {
                i = 0;
                lotes = lotes + v[index].toString() + "/" + "\n";
              }
              else {
                lotes = lotes + v[index].toString() + "/";
                if (i % 3 === 0) {
                  s = s + "\n";
                }
              }
            }

            let print = "! 0 200 200 830 2" + "\n" + "LABEL" + "\n" + "CONTRAST 0" + "\n" +
              "TONE 0" + "\n" +
              "SPEED 5" + "\n" +
              "JOURNAL" + "\n" +
              "PAGE-WIDTH 560" + "\n" +
              "GAP-SENSE" + "\n" +
              ";// PAGE 0000000005600800" + "\n" +
              "ML 47" + "\n" +
              "T 4 0 15 44 SOLICIT.(S): " + s + "\n" +
              "ENDML" + "\n" +
              "T 4 0 15 180 TALLA: " + data[x]["Talla"].toString() + "\n" +
              "T 4 0 15 260 PRODUCTO: " + data[x]["CodProd"].toString() + "\n" +
              "ML 47" + "\n" +
              "T 4 0 15 340 LOTE(S): " + lotes + "\n" +
              "ENDML" + "\n" +
              "PRINT";

            //console.log(print);
            await this._dataService.printer(print, await this._param.getvaluesMac());
            /* Retorno = Print(Buffer.ToString) */

          }

        }
      }

    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }
}

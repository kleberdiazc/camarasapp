import { Component, OnInit, ViewChild } from '@angular/core';
import { FintumbadaService } from './fintumbada.service';
import { AlertController, LoadingController, IonInput } from '@ionic/angular';
import { ResultWS, DataCombos, tb_DataGridTumbada } from './../interfaces/interfaces';
import { LoginservicesService } from './../login/loginservices.service';

@Component({
  selector: 'app-fintumbada',
  templateUrl: './fintumbada.page.html',
  styleUrls: ['./fintumbada.page.scss'],
})
export class FintumbadaPage implements OnInit {

  dataCombosCierre: DataCombos[] = [];
  cmbCierre: string = "";
  DataGrid: tb_DataGridTumbada[] = [];
  loading: any = null;

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

  async presentAlertConfirm(mensaje) {
    this.hideLoading();
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'Confirmar',
        message: mensaje,
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'SI',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
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

  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }

  constructor(private _dataService: FintumbadaService, public alertController: AlertController,
    public loadingController: LoadingController, private _log: LoginservicesService) {
    this.loadData();
    console.log(this._log.getuser().trim());
  }

  ngOnInit() {
  }

  loadData() {
    this._dataService.getDataInitial().subscribe((resp) => {

      if (resp.Codigo) {
        if (Object.keys(resp.Dt).length > 0) {

          this.dataCombosCierre = resp.Dt.Table;

        }
      } else {
        this.presentAlert("Error", resp.Description);
      }
    });
  }

  async OnChangeCierre(e) {
    this.DataGrid.length = 0;

    if (e.detail.value === "") {
      return;
    }

    await this.showLoading("Cargando...");

    const v1 = await new Promise(async (resolve) => {
      this._dataService.getDataCierre(e.detail.value.trim()).subscribe(async (resp) => {

        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.DataGrid = JSON.parse(JSON.stringify(resp.Dt.Table));

          }
        } else {
          await this.presentAlert("Error", resp.Description);
        }
        return resolve(true);
      });
    });
    this.hideLoading();
  }

  OnClickNuevo() {
    this.DataGrid.length = 0;
    this.cmbCierre = "";
  }

  async onClickGrabar() {
    try {
      if (this.cmbCierre === null || this.cmbCierre === "") {
        this.presentAlert("Advertencia", "Debe seleccionar un cierre");
        return;
      }

      if (this.DataGrid.length <= 0) {
        this.presentAlert("Advertencia", "No hay datos del cierre para finalizar");
        return;
      }

      for (let index = 0; index < this.DataGrid.length; index++) {
        if (this.DataGrid[index]["Valida"].toString().trim() === "S") {
          this.presentAlert("Advertencia", "Existen masters completos imposible finalizar");
          return;
        }
        if (this.DataGrid[index]["Valida"].toString().trim() === "A") {
          if (!await this.presentAlertConfirm("Existen masters completos esta seguro finalizar?")) {
            return;
          }
          break;
        }
      }

      await this.showLoading("Grabando...");

      const v1 = await new Promise(async (resolve) => {
        this._dataService.GrabaFinCierre(this.cmbCierre, this._log.getuser().trim()).subscribe(async (resp) => {
          if (resp.Codigo) {
            await this.presentAlert("Información", "Cierre finalizado con éxito");
            this.OnClickNuevo();
          } else {
            await this.presentAlert("Error", resp.Description);
          }
          return resolve(true);
        });
      });

      this.hideLoading();

    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }

}

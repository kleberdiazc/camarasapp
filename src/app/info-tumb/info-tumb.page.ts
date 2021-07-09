import { Cierre } from './../interfaces/interfaces';
import { InfoTumbService } from './info-tumb.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-info-tumb',
  templateUrl: './info-tumb.page.html',
  styleUrls: ['./info-tumb.page.scss'],
})
export class InfoTumbPage implements OnInit {
  cierres: Cierre[] = [];
  columns = [];
  rows = [];
  loading :any = this.loadingController.create();
  constructor(private _info: InfoTumbService,
    public alertController: AlertController,
    public loadingController: LoadingController,) {
    this.columns = [
      { prop: 'CodProd',name: 'CodProd'},
      { prop: 'Producto', name:'Producto' },
      { prop: 'talla', name: 'talla' },
      { prop: 'Lote', name: 'Lote' },
      { prop: 'Mast', name: 'Mast' },
      { prop: 'Liquidado', name: 'Liquidado' },
      { prop: 'Pallets', name: 'Pallets' },
      { prop: 'Camara1', name: 'Camara1' },
      { prop: 'camara2', name: 'camara2' },
      { prop: 'Contenedor', name: 'Contenedor' },
      { prop: 'Egresos', name: 'Egresos' },
      { prop: 'diferencia', name: 'diferencia' },
      { prop: 'ctu_numero', name: 'ctu_numero' },
      { prop: 'bod_descri', name: 'bod_descri' },
      { prop: 'ctu_fechor', name: 'ctu_fechor' },
      { prop: 'lid_codtal', name: 'lid_codtal' },
      { prop: 'OtrLiqu', name: 'OtrLiqu' },
      { prop: 'Exporta', name: 'Exporta' },
      { prop: 'Ingreso', name: 'Ingreso' },
      { prop: 'desde', name: 'desde' },
      { prop: 'hasta', name: 'hasta' },
      { prop: 'SRetrac', name: 'SRetrac' },
      { prop: 'PERCHA', name: 'PERCHA' }
    ]
   }

  ngOnInit() {
    //this.BuscarTuneles();
  }
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
  }
  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }
  
  async ionViewWillEnter() {
    await this.presentLoading("Cargando...");
    await this.BuscarTuneles();
    this.hideLoading();
  }


  async BuscarTuneles() {
    const valor = await new Promise(async (resolve) => {
    this._info.ConsultarCierres().subscribe((resp) => {
      console.log(resp);
      if (resp.Codigo) {
        if (Object.keys(resp.Dt).length > 0) {
          let dt: [][] = resp.Dt.Table;
          if (resp.Dt.Table.length > 0) {
            this.cierres = resp.Dt.Table;
            return resolve(true);
          } else {
            this.presentAlert("Error", "No Existen Datos Para Mostrar");
            return resolve(true);
          }
        }
      } else {
        this.presentAlert("Error", resp.Description);
        return resolve(true);
      }
    });
    return resolve(true);
    });
  }

  async cierreChange(event) {
    await this.presentLoading("Cargando...");
    await this.consultarDetalles(event);
    //this.hideLoading();
  }

  async consultarDetalles(event) {
    const valor = await new Promise(async (resolve) => {
      const state: string = event.target.value;
      console.log(state);
      //this.loading = this.presentLoading('Cargando');
      this._info.ConsultarDetallesCierre(state.toString()).subscribe(async(resp) => {
        
          console.log(resp);
          this.loading.dismiss();

          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              let dt: [][] = resp.Dt.Table;
              if (resp.Dt.Table.length > 0) {
                this.rows = resp.Dt.Table;
                return resolve(true);
              } else {
                this.presentAlert("Error", "No Existen Datos Para Mostrar");
                return resolve(true);
              }
            }
          } else {
            this.presentAlert("Error", resp.Description);
            return resolve(true);
          }
        });
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

  

}
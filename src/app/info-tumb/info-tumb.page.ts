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
      this.cierres = resp.Dt.Table;
    });
    return resolve(true);
    });
  }

  cierreChange(event) {
    const state: string = event.target.value;
    console.log(state);
    this.loading = this.presentLoading('Cargando');
    this._info.ConsultarDetallesCierre(state.toString()).subscribe((resp) => {
      this.rows = resp.Dt.Table;
      this.loading.dismiss();
    })
  }

  

}
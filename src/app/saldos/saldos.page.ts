import { SaldosService } from './saldos.service';
import { Component, OnInit } from '@angular/core';
import { Saldos } from '../interfaces/interfaces';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.page.html',
  styleUrls: ['./saldos.page.scss']
})
export class SaldosPage implements OnInit {
  rows: Saldos[] = [];
  columns = [];
  tallas = [];
  loading: any = this.loadingController.create();
  validationsForm: FormGroup;
  principal: boolean = false;
  segundo: boolean = true;

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
  validations = {
    'Producto': [
      { type: 'required', message: 'Producto es requerido.' },

    ],
    'Talla': [
      { type: 'required', message: 'Talla es requerido.' }
    ]
    ,
    'Lote': [
      { type: 'required', message: 'Lote es requerido.' }
    ]
  };

  constructor(private _saldos: SaldosService,
    private alertController: AlertController,
    public loadingController: LoadingController,) {
    this.columns = [
      { prop: 'BODEGA', name: 'BODEGA' },
      { prop: 'Ubica', name: 'Ubica' },
      { prop: 'PRODUCTO', name: 'PRODUCTO' },
      { prop: 'TALLA', name: 'TALLA' },
      { prop: 'LOTE', name: 'LOTE' },
      { prop: 'CJS', name: 'CJS' },
      { prop: 'MSTRS', name: 'MSTRS' },
    ]

    this.validationsForm = new FormGroup({
      'Producto': new FormControl('', Validators.compose([
        Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'Talla': new FormControl('', Validators.compose([
        //Validators.required,
        //Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Lote': new FormControl('', Validators.compose([
        //Validators.required,
        // Validators.pattern('^([-+,0-9.]+)')
      ]))
    });

  }

  async ngOnInit() {
    await this.showLoading("Cargando..");
    await this.consultarCombos();
    this.hideLoading();
  }

  async consultarCombos() {
    const valor = await new Promise(async (resolve) => {
      this._saldos.ConsultarTallas().subscribe((resp => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.tallas = resp.Dt.Table;

          }
        } else {
          this.presentAlert("Error", resp.Description);
        }
        return resolve(true);

      }));
    });
  }


  async Buscar_Saldos() {

    this.rows.length = 0;

    const valor = await new Promise(async (resolve) => {
      this._saldos.ConsultarSaldos(this.validationsForm.get('Producto').value,
        this.validationsForm.get('Talla').value,
        this.validationsForm.get('Lote').value).subscribe((resp) => {

          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              let dt: [][] = resp.Dt.Table;
              if (resp.Dt.Table.length > 0) {

                this.rows = JSON.parse(JSON.stringify(resp.Dt.Table));
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

    });
    this.hideLoading();
  }

  async onSubmit(values) {

    await this.showLoading("Cargando..");
    await this.Buscar_Saldos();
    await this.hideLoading();
    this.segundo = false;
    this.principal = true;
  }

  atras() {
    this.segundo = true;
    this.principal = false;
    this.rows = [];
  }

}

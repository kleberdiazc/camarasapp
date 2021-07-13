import { LoginservicesService } from './../login/loginservices.service';
import { Embarques, Tables } from './../interfaces/interfaces';
import { TemperaturaService } from './temperatura.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DetalleConsultaService } from '../detalle-consulta/detalle-consulta.service';

@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.page.html',
  styleUrls: ['./temperatura.page.scss'],
})
export class TemperaturaPage implements OnInit, OnDestroy {
  validationsForm: FormGroup;
  isChecked: boolean;
  myBoolean = true;
  embarques: Embarques[] = []
  Cierres: [] = []
  consulta: string;
  Emb: string;
  tipo: string = 'F';
  hideFactura: boolean = true;
  hideCierre: boolean = true;
  loading: any = this.loadingController.create();
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' },

    ],
    'temp': [
      { type: 'required', message: 'Temperatura es requerido.' }
    ]
    ,
    'emba': [
      { type: 'required', message: 'Temperatura es requerido.' }
    ],
    'Cierre': [
      { type: 'required', message: 'Temperatura es requerido.' }
    ]
  };

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

  constructor(private router: Router,
    private alertController: AlertController,
    private _temp: TemperaturaService,
    private _log: LoginservicesService,
    public loadingController: LoadingController) {
    this.validationsForm = new FormGroup({
      'sscc': new FormControl('', Validators.compose([
        Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'temp': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([-+,0-9.]+)')
      ])),
      'emba': new FormControl('', Validators.compose([
        //Validators.required,
        // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Cierre': new FormControl('', Validators.compose([
        //Validators.required,
        // Validators.pattern('^([-+,0-9.]+)')
      ])),
    });


  }

  async ngOnInit() {
    /*  await this.showLoading("Cargando..");
     await this.BuscarEmbarques();
     await this.cierres(); */

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
  async ionViewWillEnter() {
    await this.showLoading("Cargando..");
    await this.BuscarEmbarques();
    await this.cierres();
    this.hideLoading();
  }


  OnChangeRad(event) {
    const state: string = event.target.value;
    console.log(state);
    this.tipo = state;
    if (this.tipo == 'F') {
      this.hideFactura = false;
      this.hideCierre = true;
    }
    if (this.tipo == 'C') {
      this.hideFactura = true;
      this.hideCierre = false;
    }

  }

  onKeydown(event) {
    console.log(event);
  }

  async onSubmit(values) {
    await this.showLoading("Grabando..");
    const valor = await new Promise(async (resolve) => {
      if (this.tipo == 'F') {
        this._temp.GrabarFactura(this.tipo, '0', this.validationsForm.get('emba').value, this.validationsForm.get('temp').value.toString()
          , this.validationsForm.get('sscc').value
          , await this._log.getuser()).subscribe(async (resp) => {

            if (resp.Codigo) {
              this.presentAlert("Información", "La transacción se ha realizado con exito.");
            } else {
              this.presentAlert("Error", resp.Description);

            }
            return resolve(true);
          });
      }
      if (this.tipo == 'C') {
        this._temp.GrabarFactura(this.tipo, this.validationsForm.get('Cierres').value, '0', this.validationsForm.get('temp').value.toString()
          , this.validationsForm.get('sscc').value
          , await this._log.getuser()).subscribe(async (resp) => {
            if (resp.Codigo) {
              this.presentAlert("Información", "La transacción se ha realizado con exito.");
            } else {
              this.presentAlert("Error", resp.Description);

            }
            return resolve(true);

          });
      }
    });

  }

  async BuscarEmbarques() {
    const valor = await new Promise(async (resolve) => {
      this._temp.ConsultarFacturas().subscribe((resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            this.embarques = resp.Dt.Table;
          }
        } else {
          this.presentAlert("Error", resp.Description);

        }
        return resolve(true);
      });
    });
  }

  /*  BuscaCierres() {
 
   } */

  async cierres() {
    const valor = await new Promise(async (resolve) => {
      this._temp.ConsultarCierre().subscribe((resp) => {

        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            let dt: [][] = resp.Dt.Table;
            if (resp.Dt.Table.length > 0) {
              this.Cierres = resp.Dt.Table;
            } else {
              this.presentAlert("Error", "No Existen Datos Para Mostrar");
            }
          }
          return resolve(true);
        } else {
          this.presentAlert("Error", resp.Description);
          return resolve(true);
        }
      });

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


  Cerrar() {
    console.log("Cerrar");
  }

  onClick() {
    this.BuscarEmbarques();
  }

}

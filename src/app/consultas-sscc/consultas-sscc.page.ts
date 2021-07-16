import { DetalleConsultaService } from './../detalle-consulta/detalle-consulta.service';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-consultas-sscc',
  templateUrl: './consultas-sscc.page.html',
  styleUrls: ['./consultas-sscc.page.scss'],
})
export class ConsultasSsccPage implements OnInit {
  validationsForm: FormGroup;
  isChecked: boolean;
  myBoolean: boolean = false;
  consulta: string;
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
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

  constructor(private router: Router,
    private _detalle: DetalleConsultaService,
    public alertController: AlertController,
    public loadingController: LoadingController,) {
    this.validationsForm = new FormGroup({
      'sscc': new FormControl('', Validators.compose([
        //Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });


  }
  ngOnInit() {
    this.isChecked = false;
  }


  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return this.loading.present();
  }

  async onSubmit() {
    console.log('SUBMIT');
    await this.showLoading("Cargando...");
    await this.bringData();
    this.hideLoading();



  }

  async bringData() {

    let ssccs = this.validationsForm.get('sscc').value;
    if (ssccs.length == 20) {

      let navigationExtras: NavigationExtras = {
        state: {
          sscc: this.validationsForm.get('sscc').value.substring(2, 20),
          resumido: this.myBoolean,
          consulta: this.consulta
        }
      }
      const valor = await new Promise(async (resolve) => {
        this._detalle.ValidarConsulta(this.consulta, this.validationsForm.get('sscc').value.substring(2, 20)).subscribe(async (resp) => {

          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              let dt: [][] = resp.Dt.Table;
              if (resp.Dt.Table.length > 0) {
                this.presentAlert("Información", dt[0]["INFO"].toString());
                return resolve(true);
              }
            }
          } else {
            this.presentAlert("Error", resp.Description);
            return resolve(true);
          }
          this.router.navigate(['app/consultas-sscc/detalle-consulta'], navigationExtras);
          console.log(this.validationsForm.get('sscc').value);

          return resolve(true);

        });

      });
    }
  }


  onKeydown(event) {
    console.log(event);
  }

  async keyChange(event) {
    console.log('KEYCHANGE');
    if (this.validationsForm.get('sscc').value.length === 20) {
      await this.showLoading("Cargando...");
      await this.bringData();
      this.hideLoading();
    }
  }

  OnChangeRad(event) {
    const state: string = event.target.value;
    console.log(state);
    this.consulta = state;

  }

  onMyBooleanChange() {
    console.log(this.myBoolean);
  }
}

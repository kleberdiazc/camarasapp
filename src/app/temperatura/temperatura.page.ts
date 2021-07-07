import { LoginservicesService } from './../login/loginservices.service';
import { Embarques, Tables } from './../interfaces/interfaces';
import { TemperaturaService } from './temperatura.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DetalleConsultaService } from '../detalle-consulta/detalle-consulta.service';

@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.page.html',
  styleUrls: ['./temperatura.page.scss'],
})
export class TemperaturaPage implements OnInit,OnDestroy {
  validationsForm: FormGroup;
  isChecked: boolean;
  myBoolean = true;
  embarques: Embarques[] = []
  consulta: string;
  Emb: string;
  tipo: string = 'F';
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
    ]
  };
  constructor(private router: Router,
    private alertController: AlertController,
    private _temp: TemperaturaService,
    private _log: LoginservicesService) {
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
        Validators.required,
        // Validators.pattern('^([-+,0-9.]+)')
      ])),
    });


  }

  ngOnInit() {
    this.BuscarEmbarques();
    console.log("entre");
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log("destrui");
  }
  ionViewWillEnter() {
    this.BuscarEmbarques();
  }


  OnChangeRad(event) {
    const state: string = event.target.value;
    console.log(state);
    this.tipo = state;

  }

  onKeydown(event) {
    console.log(event);
  }

  async onSubmit(values) {
    this._temp.GrabarFactura(this.tipo, '0', this.validationsForm.get('emba').value, this.validationsForm.get('temp').value.toString()
      , this.validationsForm.get('sscc').value
      , await this._log.getuser()).subscribe(async (resp) => {
        console.log(resp);
        if (resp.Codigo.toString() == 'false') {
          const alert = await this.alertController.create({
            header: 'Error!',
            message: resp.Description,
            buttons: ['OK']
          });
          await alert.present();

        } else {
          const alert = await this.alertController.create({
            header: 'Guardado Exitoso!!',
            message: 'La transacción se ha realizado con exito.',
            buttons: ['OK']
          });
          await alert.present();

        }
      })

  }

  BuscarEmbarques() {
    this._temp.ConsultarFacturas().subscribe((resp) => {
      console.log('consulta factura', resp);
      this.embarques = resp.Dt.Table;
    });
  }


  Cerrar() {
    console.log("Cerrar");
  }

  onClick() {
    this.BuscarEmbarques();
  }

}

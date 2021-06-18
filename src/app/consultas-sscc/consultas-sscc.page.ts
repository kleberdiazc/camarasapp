import { DetalleConsultaService } from './../detalle-consulta/detalle-consulta.service';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  myBoolean = true;
  consulta: string;
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
  constructor( private router : Router,
    private alertController: AlertController,
          private _detalle:DetalleConsultaService) {
      this.validationsForm = new FormGroup({
      'sscc': new FormControl('',Validators.compose([
      //Validators.required
      //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
      });


    }
  ngOnInit() {
    this.isChecked = true;
  }

  onSubmit(values) {
    let navigationExtras: NavigationExtras = {
      state: {
        sscc: this.validationsForm.get('sscc').value,
        resumido: this.myBoolean,
        consulta: this.consulta
      }
    }
    this._detalle.ValidarConsulta(this.consulta, this.validationsForm.get('sscc').value).subscribe(async (resp) => {
      console.log(resp);
      if (resp.Codigo.toString() == 'true') {
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
    });
    this.router.navigate(['app/consultas-sscc/detalle-consulta'],navigationExtras);
    console.log(this.validationsForm.get('sscc').value);
    
  }

  onKeydown(event) {
    console.log(event);
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

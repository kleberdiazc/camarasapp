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
  myBoolean = true;
  consulta: string;
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
  loading :any = this.loadingController.create();
  constructor( private router : Router,
    private _detalle: DetalleConsultaService,
    public alertController: AlertController,
    public loadingController: LoadingController,) {
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


  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
  }
  
  onSubmit(values) {
    let navigationExtras: NavigationExtras = {
      state: {
        sscc: this.validationsForm.get('sscc').value.substring(2, 20),
        resumido: this.myBoolean,
        consulta: this.consulta
      }
    }
    this.loading = this.presentLoading('Cargando');
    this._detalle.ValidarConsulta(this.consulta, this.validationsForm.get('sscc').value).subscribe(async (resp) => {
      this.loading.dismiss();
      console.log(resp);
      if (resp.Codigo.toString() == 'false') {
        const alert = await this.alertController.create({
          header: 'Error!',
          message: resp.Description,
          buttons: ['OK']
        });
        await alert.present();
        
      } else {
        this.router.navigate(['app/consultas-sscc/detalle-consulta'],navigationExtras);
        console.log(this.validationsForm.get('sscc').value);
        
       }
    });
   
    
  }

  onKeydown(event) {
    console.log(event);
  }

  keyChange(event) {
    let ssccs = this.validationsForm.get('sscc').value;
    if (ssccs.length==20) {
      let navigationExtras: NavigationExtras = {
        state: {
          sscc: this.validationsForm.get('sscc').value.substring(2, 20),
          resumido: this.myBoolean,
          consulta: this.consulta
        }
      }
      this._detalle.ValidarConsulta(this.consulta, this.validationsForm.get('sscc').value).subscribe(async (resp) => {
        console.log(resp);
        if (resp.Codigo.toString() == 'false') {
          const alert = await this.alertController.create({
            header: 'Error!',
            message: resp.Description,
            buttons: ['OK']
          });
          await alert.present();
          
        } else {
           this.router.navigate(['app/consultas-sscc/detalle-consulta'],navigationExtras);
          console.log(this.validationsForm.get('sscc').value);
          
         }
      });
     
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

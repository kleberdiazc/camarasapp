import { DetallePalletService } from './detalle-pallet.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DetalleConsultaService } from '../detalle-consulta/detalle-consulta.service';

@Component({
  selector: 'app-detalle-pallet',
  templateUrl: './detalle-pallet.page.html',
  styleUrls: ['./detalle-pallet.page.scss'],
})
export class DetallePalletPage implements OnInit {
  validationsForm: FormGroup;
  isChecked: boolean;
  myBoolean = true;
  consulta: string;
  rows = [];
  columns = [];
  loading :any = this.loadingController.create();
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
  constructor( private router : Router,
    private alertController: AlertController,
          private _detalle:DetallePalletService,
          public loadingController: LoadingController,
           ) {

            this.columns = [
              { prop: 'Cod',name: 'Cod'},
              { prop: 'Talla', name:'Talla' },
              { prop: 'Lote', name: 'Lote' },
              { prop: 'Master', name: 'Master' }
            ]
    

      this.validationsForm = new FormGroup({
      'sscc': new FormControl('',Validators.compose([
      //Validators.required
      //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
      });


    }
    async presentLoading(mensaje: string) {
      this.loading = await this.loadingController.create({
        message: mensaje
      });
      return  this.loading.present();
    }

    ngOnInit() {
      this.isChecked = true;
    }
  
    onSubmit(values) {
      this.loading = this.presentLoading('Cargando');
      this._detalle.ConsultarDetallePallet(this.validationsForm.get('sscc').value).subscribe(async (resp) => {
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
          this.rows = resp.Dt.Table;
          
         }
      });
     
      console.log(this.validationsForm.get('sscc').value);
      
    }
  
    onKeydown(event) {
      console.log(event);
    }
  

}

import { SuministrosService } from './suministros.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ConsultTransacService } from '../consult-transac/consult-transac.service';
import { Tipo, Bodega, Trans, Proceso } from '../interfaces/interfaces';
import { LoginservicesService } from '../login/loginservices.service';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-suministros',
  templateUrl: './suministros.page.html',
  styleUrls: ['./suministros.page.scss'],
})
export class SuministrosPage implements OnInit {
  Item = [];
  Origen = [];
  Destino = [];

  loading :any = this.loadingController.create();
  validationsForm: FormGroup;


  validations = {
    'Sello': [
      { type: 'required', message: 'Tipo es requerido.' },
      
    ],
    'Item': [
      { type: 'required', message: 'Bodega es requerido.' }
    ]
    ,
    'Cantidad': [
      { type: 'required', message: 'Proceso es requerido.' }
    ]
    ,
    'Origen': [
      { type: 'required', message: 'Trans es requerido.' }
    ],
    'Destino': [
      { type: 'required', message: 'Trans es requerido.' }
    ]
  };
  
  constructor( private router : Router,
    private alertController: AlertController,
    private _transac: ConsultTransacService,
    private _log: LoginservicesService,
    public loadingController: LoadingController,
    public _suministrto:SuministrosService) {


      
      this.validationsForm = new FormGroup({
      'Sello': new FormControl('',Validators.compose([
       Validators.required
      //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'Item': new FormControl('',Validators.compose([
        Validators.required,
      ])),
      'Cantidad': new FormControl('',Validators.compose([
        Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Origen': new FormControl('',Validators.compose([
        Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Destino': new FormControl('',Validators.compose([
        Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
      ]))
      });
  }
  
  
  ngOnInit() {
    this.consultarCombos();
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
  }
  
  consultarCombos() {
    this._suministrto.ConsultarDatos("1",this._log.getuser()).subscribe((resp => {
      console.log(resp);
      this.Item = resp.Dt.Table;
      this.Origen = resp.Dt.Table1;
      this.Destino = resp.Dt.Table2;
    }));
  }
  
  onSubmit(values) {
    this.loading = this.presentLoading('Cargando');

    this._suministrto.ConsultarTransac(this.validationsForm.get('Sello').value,
       this.validationsForm.get('Item').value,
      this.validationsForm.get('Cantidad').value, this.validationsForm.get('Origen').value,
      this.validationsForm.get('Destino').value, "1",
      this._log.getuser()).subscribe(async (resp) => {
        console.log(resp);
        this.loading.dismiss();
        
         if (resp.Codigo.toString() == 'false') {
          const alert = await this.alertController.create({
            header: 'Error!',
            message: resp.Description,
            buttons: ['OK']
          });
          await alert.present();
          
        } else {
          const alert = await this.alertController.create({
            header: 'Sucess!',
            message: 'Transferencia grabada con éxito',
            buttons: ['OK']
          });
          await alert.present();
         }
      })

      

    
  }


  imprimir(tipo:string) {
    this._suministrto.Imprimir(this.validationsForm.get('Sello').value, tipo);
    //FALTA IMPRIMIR
  }

}

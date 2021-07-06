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
  itemName = '';
  origenName = '';
  destinoName = '';

  loading: any = this.loadingController.create();
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

  constructor(private router: Router,
    private alertController: AlertController,
    private _transac: ConsultTransacService,
    private _log: LoginservicesService,
    public loadingController: LoadingController,
    public _suministrto: SuministrosService) {



    this.validationsForm = new FormGroup({
      'Sello': new FormControl('', Validators.compose([
        Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'Item': new FormControl('', Validators.compose([
        Validators.required,
      ])),
      'Cantidad': new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Origen': new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Destino': new FormControl('', Validators.compose([
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
    return this.loading.present();
  }

  async consultarCombos() {
    this._suministrto.ConsultarDatos("1", await this._log.getuser()).subscribe((resp => {
      console.log(resp);
      this.Item = resp.Dt.Table;
      this.Origen = resp.Dt.Table1;
      this.Destino = resp.Dt.Table2;
    }));
  }

  async onSubmit(values) {
    this.loading = this.presentLoading('Cargando');

    this._suministrto.ConsultarTransac(this.validationsForm.get('Sello').value,
      this.validationsForm.get('Item').value,
      this.validationsForm.get('Cantidad').value, this.validationsForm.get('Origen').value,
      this.validationsForm.get('Destino').value, "1",
      await this._log.getuser()).subscribe(async (resp) => {
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
          this.imprimir("GRABAR")
        }
      })




  }

  imprimirConsu() {
    this.imprimir("CONSULTA");
  }

  change($event) {
    console.log($event.target.value, this.itemName);
    var item = this.Item.find(item => item['CODIGO'] === $event.target.value);
    this.itemName = item.DESCRIPCION;
  }

  changeOr($event) {
    var item = this.Origen.find(item => item['CODIGO'] === $event.target.value);
    this.origenName = item.DESCRIPCION;
  }

  changeDes($event) {
    var item = this.Destino.find(item => item['CODIGO'] === $event.target.value);
    this.destinoName = item.DESCRIPCION;
  }
  imprimir(tipo) {


    let sello = this.validationsForm.get('Sello').value;
    let us = '';
    let item = '';
    let origen = '';
    let destino = '';
    let cantidad = '';
    let fecha;
    this._suministrto.Imprimir(sello, tipo).subscribe(async (resp) => {
      let table = [];
      table = resp.Dt.Table;
      if (table.length > 0) {
        fecha = table[0]["Fecha"];
        if (tipo = 'GRABAR') {
          us = await this._log.getuser();
          item = this.validationsForm.get('Item').value;
          origen = this.validationsForm.get('Origen').value;
          destino = this.validationsForm.get('Destino').value;
          cantidad = this.validationsForm.get('Cantidad').value;
        }
        else {
          us = table[0]["trc_usucre"];
          item = table[0]["ite_descri"];
          origen = table[0]["Origen"];
          destino = table[0]["Destino"];
          cantidad = table[0]["tcd_cantid"]

        }
        let cadena = ' 0 200 200 830 1' + '\n' + 'LABEL' + '\n' + 'CONTRAST 0' + '\n' +
          'TONE 0' + '\n' +
          'SPEED 5' + '\n' +
          'JOURNAL' + '\n' +
          'PAGE-WIDTH 560' + '\n' +
          'BAR-SENSE' + '\n' +
          ';// PAGE 0000000005600800' + '\n' +
          'CENTER' + '\n' +
          'T 5 1 0 44 TRANSFERENCIA DE ' + this.itemName.toUpperCase() + '\n' + '\n' +
          'T 5 0 38 92 Usuario: ' + us + '\n' +
          'T 5 0 38 140 Fecha: ' + fecha + '\n' + '\n' +
          'T 5 0 38 188 Sello: ' + sello + '\n' +
          'T 5 0 38 236 Item: ' + this.itemName.toUpperCase() + '\n' +
          'T 5 0 38 248 Bod. Origen: ' + this.origenName + '\n' +
          'T 5 0 38 332 Bod. Destino: ' + this.destinoName + '\n' +
          'T 5 0 38 380 Cantidad: ' + cantidad + '\n' +
          'ENDML' + '\n' +
          'PRINT' + '\n';

        console.log(cadena);
      }
      else {

        const alert = await this.alertController.create({
          header: 'Error!',
          message: resp.Description,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
    //FALTA IMPRIMIR
  }

}

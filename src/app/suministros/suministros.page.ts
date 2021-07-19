import { SuministrosService } from './suministros.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ConsultTransacService } from '../consult-transac/consult-transac.service';
import { Tipo, Bodega, Trans, Proceso } from '../interfaces/interfaces';
import { LoginservicesService } from '../login/loginservices.service';
import { subscribeOn } from 'rxjs/operators';
import { ParametrosService } from '../parametros/parametros.service';

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
      { type: 'required', message: 'Sello es requerido.' },

    ],
    'Item': [
      { type: 'required', message: 'Item es requerido.' }
    ]
    ,
    'Cantidad': [
      { type: 'required', message: 'Cantidad es requerido.' }
    ]
    ,
    'Origen': [
      { type: 'required', message: 'Origen es requerido.' }
    ],
    'Destino': [
      { type: 'required', message: 'Destino es requerido.' }
    ]
  };

  constructor(private router: Router,
    private alertController: AlertController,
    private _transac: ConsultTransacService,
    private _log: LoginservicesService,
    public loadingController: LoadingController,
    public _suministrto: SuministrosService,
    private _param: ParametrosService) {



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
      ]))
      ,
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


  async ngOnInit() {
    await this.showLoading("Cargando..");
    await this.consultarCombos();
    this.hideLoading();
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return this.loading.present();
  }

  async consultarCombos() {
    const valor = await new Promise(async (resolve) => {
      this._suministrto.ConsultarDatos("1", await this._log.getuser()).subscribe((resp => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {

            this.Item = resp.Dt.Table;
            this.Origen = resp.Dt.Table1;
            this.Destino = resp.Dt.Table2;

          }
        } else {
          this.presentAlert("Error", resp.Description);
        }
        return resolve(true);

      }));
    });
  }

  async onSubmit(values) {
    await this.showLoading("Grabando..");
    await this.grabar();
    this.hideLoading();
    //this.removeValidators(this.validationsForm);
    
  }

  async grabar() {
    const valor = await new Promise(async (resolve) => {
      this._suministrto.ConsultarTransac(this.validationsForm.get('Sello').value,
        this.validationsForm.get('Item').value,
        this.validationsForm.get('Cantidad').value, this.validationsForm.get('Origen').value,
        this.validationsForm.get('Destino').value, "1",
        await this._log.getuser()).subscribe(async (resp) => {
          if (resp.Codigo.toString() == 'false') {
            await this.presentAlert("Error", resp.Description);

          } else {
            await this.presentAlert("Sucess!", "Transferencia grabada con éxito");

            await this.imprimir("GRABAR")
          }
          return resolve(true);
        });
      
    });
    this.validationsForm.reset({
      'Sello': '',
      'Item': '',
      'Cantidad': '',
      'Origen': '',
      'Destino': ''
    });

 }

  imprimirConsu() {
    this.imprimir("CONSULTA");
  }

  /*change($event) {
    console.log($event.target.value, this.itemName);
    var item = this.Item.find(item => item['CODIGO'] === $event.target.value);
    this.itemName = item.DESCRIPCION;
  }*/

  /* changeOr($event) {
    debugger;
    var item = this.Origen.find(item => item['CODIGO'] === $event.target.value);
    this.origenName = item.DESCRIPCION;
  }

  changeDes($event) {
    debugger;
    var item = this.Destino.find(item => item['CODIGO'] === $event.target.value);
    this.destinoName = item.DESCRIPCION;
  } */
  async imprimir(tipo) {
    

    let sello = this.validationsForm.get('Sello').value;
    let us = '';
    let item = '';
    let origen = '';
    let destino = '';
    let cantidad = '';
    let fecha;
    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;
      const v2 = await new Promise(async (resolve) => {
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
            //this.dataCombosTipoConv.find(s => s.CODIGO === this.cmbTipoConv)["DESCRIPCION"].toString().trim()
            this.itemName = this.Item.find(r => r['CODIGO'] === item)["DESCRIPCION"].toString().trim();
            this.origenName = this.Origen.find(r => r['CODIGO'] === origen)["DESCRIPCION"].toString().trim();
            this.destinoName = this.Destino.find(r => r['CODIGO'] === destino)["DESCRIPCION"].toString().trim();
            let cadena = ' 0 200 200 830 1' + String.fromCharCode(13) + String.fromCharCode(10) + 'LABEL' + String.fromCharCode(13) + String.fromCharCode(10) + 'CONTRAST 0' + String.fromCharCode(13) + String.fromCharCode(10) +
              'TONE 0' + String.fromCharCode(13) + String.fromCharCode(10) +
              'SPEED 5' + String.fromCharCode(13) + String.fromCharCode(10) +
              'JOURNAL' + String.fromCharCode(13) + String.fromCharCode(10) +
              'PAGE-WIDTH 560' + String.fromCharCode(13) + String.fromCharCode(10) +
              'BAR-SENSE' + String.fromCharCode(13) + String.fromCharCode(10) +
              ';// PAGE 0000000005600800' + String.fromCharCode(13) + String.fromCharCode(10) +
              'CENTER' + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 1 0 44 TRANSFERENCIA DE ' + this.itemName.toUpperCase() + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 92 Usuario: ' + us + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 140 Fecha: ' + fecha + String.fromCharCode(13) + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 188 Sello: ' + sello + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 236 Item: ' + this.itemName.toUpperCase() + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 248 Bod. Origen: ' + this.origenName + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 332 Bod. Destino: ' + this.destinoName + String.fromCharCode(13) + String.fromCharCode(10) +
              'T 5 0 38 380 Cantidad: ' + cantidad + String.fromCharCode(13) + String.fromCharCode(10) +
              'ENDML' + String.fromCharCode(13) + String.fromCharCode(10) +
              'PRINT' + String.fromCharCode(13) + String.fromCharCode(10);

            console.log(cadena);
            rsPrint = await this._suministrto.printer(cadena, await this._param.getvaluesMac());
            if (rsPrint) {
              await this.presentAlert("Información", "Impresión realizada");
            }
          }
          else {
            await this.presentAlert("Error", resp.Description);
          }
          return resolve(true);
        }); 
      });

    } catch (error) {
      await this.presentAlert("Error", error);
    }
    //this.hideLoading();

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

  async showLoading(mensaje) {
    /* this.loading = this.loadingController.create({
      message: 'This Loader will Not AutoHide'
    }).then((res) => {
      res.present();
    }); */
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

}

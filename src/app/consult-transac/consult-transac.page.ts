
import { Bodega, Proceso, Tipo, Trans } from './../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginservicesService } from '../login/loginservices.service';
import { TemperaturaService } from '../temperatura/temperatura.service';
import { ConsultTransacService } from './consult-transac.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { SelectionType } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-consult-transac',
  templateUrl: './consult-transac.page.html',
  styleUrls: ['./consult-transac.page.scss'],
})
export class ConsultTransacPage implements OnInit {
  Tipos: Tipo[] = [];
  Bodegas: Bodega[] = [];
  Trans: Trans[] = [];
  Procesos: Proceso[] = [];
  rows = [];
  columns = [];
  detalle = [];

  rowsRes = [];
  columnsRes = [];
  temp = [];

  loading :any = this.loadingController.create();
  validationsForm: FormGroup;
  principal:boolean= false;
  segundo:boolean=true;
  tercero: boolean = true;
  myBoolean = true;
  usuario: string = '';
  selected = [];
  SelectionType = SelectionType;
  myDate: String = new Date().toISOString();
  private datePipe: DatePipe;

  validations = {
    'Tipo': [
      { type: 'required', message: 'Tipo es requerido.' },
      
    ],
    'Bodega': [
      { type: 'required', message: 'Bodega es requerido.' }
    ]
    ,
    'Proceso': [
      { type: 'required', message: 'Proceso es requerido.' }
    ]
    ,
    'Trans': [
      { type: 'required', message: 'Trans es requerido.' }
    ],
    'Desde': [
      { type: 'required', message: 'Trans es requerido.' }
    ],
    'Hasta': [
      { type: 'required', message: 'Trans es requerido.' }
    ]
  };
  
  constructor( private router : Router,
    private alertController: AlertController,
    private _transac: ConsultTransacService,
    private _log: LoginservicesService,
    public loadingController: LoadingController) {


        this.columns = [
          { prop: 'NUMSEC',name: 'NUMSEC'},
          { prop: 'NUMTRA', name:'NUMTRA' },
          { prop: 'FECHA', name: 'FECHA' },
          { prop: 'TIPO', name: 'TIPO' },
          { prop: 'ESTADO', name: 'ESTADO' },
          { prop: 'OBSERV', name: 'OBSERV' },
          { prop: 'USUARIO', name: 'USUARIO' },
        ]

        this.columnsRes = [
          { prop: 'LOTE',name: 'LOTE'},
          { prop: 'CODPROD', name:'CODPROD' },
          { prop: 'PRODUCTO', name: 'PRODUCTO' },
          { prop: 'TALLA', name: 'TALLA' },
          { prop: 'CJS', name: 'CJS' },
          { prop: 'MSTRS', name: 'MSTRS' },
          { prop: 'USUARIO', name: 'USUARIO' },
        ]
      
      this.validationsForm = new FormGroup({
      'Tipo': new FormControl('',Validators.compose([
       Validators.required
      //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'Bodega': new FormControl('',Validators.compose([
        Validators.required,
      ])),
      'Proceso': new FormControl('',Validators.compose([
        //Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Trans': new FormControl('',Validators.compose([
        //Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Desde': new FormControl(this.myDate,Validators.compose([
        Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
      ])),
      'Hasta': new FormControl(this.myDate,Validators.compose([
        Validators.required,
       // Validators.pattern('^([-+,0-9.]+)')
        ]))
      });
  }
  
  
  async ngOnInit() {
    await this.presentLoading("Cargando...");
    await this.consultarCombos();
    this.hideLoading();
  }
  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
  }
  
  async consultarCombos() {
    const valor = await new Promise(async (resolve) => {
    this._transac.ConsultarBodegas("1").subscribe((resp => {

      console.log(resp);
      this.Tipos = resp.Dt.Table;
      this.Bodegas = resp.Dt.Table1;
      this.Procesos = resp.Dt.Table2;
      this.Trans = resp.Dt.Table3;
      return resolve(true);
    }));
      
  });
  }
  
  onSubmit(values) {
    let fechaHasta: Date = this.validationsForm.get('Hasta').value;
    let fechaDesde: Date = this.validationsForm.get('Desde').value;
    //this.datePipe.transform(fecha,'yyyy/MM/dd')
    let desde = moment(fechaDesde).format('YYYY/MM/DD'); // 2019-04-22
    let hasta = moment(fechaHasta).format('YYYY/MM/DD'); // 2019-04-22

    this.loading = this.presentLoading('Cargando');
    this._transac.ConsultarTransac(this.validationsForm.get('Bodega').value,
      this.usuario,
      this.validationsForm.get('Tipo').value, desde,
       hasta, this.validationsForm.get('Proceso').value,
      this.validationsForm.get('Trans').value).subscribe(async(resp) => {
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
          this.segundo = false;
          this.principal = true;
          this.rows = resp.Dt.Table;
          
         }
      })



      

    
  }

  async onSiguienteSegundo(){
    this.tercero = false;
    this.segundo = true;
    this.principal = true;
    await this.presentLoading("Cargando...");
    await this.getResumen();
    this.hideLoading();

  }

  onAtrasSegundo(){
    this.tercero = true;
    this.segundo = true;
    this.principal = false;
  }

  onAtrasTercero(){
    this.tercero = true;
    this.segundo = false;
    this.principal = true;
  }

  async onSelect(e) {
    
    await this.presentLoading("Cargando...");
    await this.setselect(e);
    this.hideLoading();
    //console.log(this.selected[0].tran.toString());
  }


  async setselect(e) {
    const valor = await new Promise(async (resolve) => {
      console.log(e.selected[0]["NUMTRA"].toString());
      console.log(this.selected);
      //this.loading = this.presentLoading('Cargando');
      this._transac.DetalleTransac(e.selected[0]["NUMTRA"]).subscribe(async (resp) => {
        //this.loading.dismiss();
          
           if (resp.Codigo.toString() == 'false') {
            const alert = await this.alertController.create({
              header: 'Error!',
              message: resp.Description,
              buttons: ['OK']
            });
            await alert.present();
            
          } else {
  
            this.detalle = resp.Dt.Table;
            
           }
      })
      return resolve(true);
      });
  }

  async getResumen() {
    const valor = await new Promise(async (resolve) => {
    let lote: string;
    if (this.myBoolean) {
      lote = 'S'
    } else {
      lote = 'N'
    }
    let fechaHasta: Date = this.validationsForm.get('Hasta').value;
    let fechaDesde: Date = this.validationsForm.get('Desde').value;
    //this.datePipe.transform(fecha,'yyyy/MM/dd')
    let desde = moment(fechaDesde).format('YYYY/MM/DD'); // 2019-04-22
    let hasta = moment(fechaHasta).format('YYYY/MM/DD'); // 2019-04-22

    this._transac.ResumenTransac(this.validationsForm.get('Bodega').value,
      this.usuario,
      this.validationsForm.get('Tipo').value,desde,
      hasta, this.validationsForm.get('Proceso').value,
      this.validationsForm.get('Trans').value,lote,'').subscribe(async(resp) => {
        console.log(resp);
        //this.loading.dismiss();
        
         if (resp.Codigo.toString() == 'false') {
          const alert = await this.alertController.create({
            header: 'Error!',
            message: resp.Description,
            buttons: ['OK']
          });
          await alert.present();
          
        } else {
           this.rowsRes = resp.Dt.Table;
          
          
         }
      })
      return resolve(true);
      });

  }
  onMyBooleanChange() {
    console.log(this.myBoolean);
  }
}

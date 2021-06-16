import { Component, OnInit } from '@angular/core';
import { TransaccionesService } from './transacciones.service';
import { ResultWS,DataCombos,TablaCodigo } from './../interfaces/interfaces';
import { Console } from 'console';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.page.html',
  styleUrls: ['./transacciones.page.scss'],
})
export class TransaccionesPage implements OnInit {
  dataCombosTipo:DataCombos[] = [];
  dataCombosMotivo:DataCombos[] = [];
  dataCombosOrigen:DataCombos[] = [];
  dataCombosDestino:DataCombos[] = [];
  dataCombosReci:DataCombos[] = [];
  dataCombosMQ:DataCombos[] = [];
  dataCombosTipoConv:DataCombos[] = [];
  dataCombosMovil:DataCombos[] = [];
  dataCombosChofer:DataCombos[] = [];
  respTable:TablaCodigo[] = [];

  cmbTipo:string;
  cmbMotivo: string;
  cmbOrigen: string;
  cmbDestino: string;
  cmbReci:  string;
  cmbMQ:  string;
  cmbTipoConv: string;
  cmbMovil: string;
  cmbChofer: string;
  

  tab = 'Tab1';
  constructor(private _dataCombos:TransaccionesService) {
    this.loadData();
  }
  ngOnInit() {
    
  }
 
  loadData() {
    this._dataCombos.getDataInitial().subscribe((resp) => {
     this.dataCombosTipo = resp.Dt.Table;
    }); 
  }

  loadDataMotivo(mov:string) {
    
    this._dataCombos.getDataMotivo(mov).subscribe((resp) => {
     this.dataCombosMotivo = resp.Dt.Table;
     this.dataCombosOrigen = resp.Dt.Table1;
     this.dataCombosDestino = resp.Dt.Table1;
     this.dataCombosReci =  resp.Dt.Table2;
     this.dataCombosMQ =  resp.Dt.Table3;
     this.dataCombosTipoConv = resp.Dt.Table4;
     this.dataCombosMovil = resp.Dt.Table5;
     this.dataCombosChofer = resp.Dt.Table6;
    }); 
  }

  OnChangeTipo(e){
    this.cmbMotivo = null;
    this.cmbOrigen = null;
    this.cmbDestino = null;
    this.loadDataMotivo(e.detail.value);
  }

  OnChangeMovil(e){
    this._dataCombos.getDataChofer(e.detail.value).subscribe((resp) => {
      if (resp.Dt.Table.length > 0){
        this.respTable = resp.Dt.Table;
        this.cmbChofer = this.respTable[0].Codigo;
      }
      
     });
    
  }

  show(tab) {
    this.tab = tab;
  }
}


import { subscribeOn } from 'rxjs/operators';
import { DetalleConsultaService } from './detalle-consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SaldosGlobal } from '../interfaces/interfaces';

@Component({
  selector: 'app-detalle-consulta',
  templateUrl: './detalle-consulta.page.html',
  styleUrls: ['./detalle-consulta.page.scss'],
})
export class DetalleConsultaPage implements OnInit {
  rows = [];
  columns = [];
  total: number = 0;
  sscc: string;
  resumido: boolean;
  consulta: string;
  data: any;
  tipo: string = "CAJA"
  codigo: string;
  talla: string;
  Descri: string;
  Lote: string;
  Total: string;
  Pallet: string
  saldo: string;
  bodega: string;

  constructor(private route:ActivatedRoute,private router:Router,private _detalle:DetalleConsultaService) {
    this.columns = [
      { prop: 'Cod',name: 'Cod'},
      { prop: 'Talla', name:'Talla' },
      { prop: 'Descri', name: 'Descri' },
      { prop: 'Lote', name: 'Lote' },
      { prop: 'Master', name: 'Master' },
      { prop: 'sscc_Bodega', name: 'Bodega' },
      { prop: 'LIBRAS', name: 'LIBRAS' },
    ]
    if (this.router.getCurrentNavigation().extras.state) {
      console.log(this.router.getCurrentNavigation().extras.state.sscc)
      this.data = this.router.getCurrentNavigation().extras.state;
      if (this.data.sscc.substring(1, 9) == '786115922' || this.data.sscc.substring(1, 9) == '786120672') {
          this.tipo = "CAJA"
        }
      if (this.data.sscc.substring(1, 9) == '786115923' || this.data.sscc.substring(1, 9) == '786120673') {
        this.tipo = "MASTER"
        }
      
    }
    let resum;
    
    if (this.data.resumido) {
      resum = 'S';
    } else {
      resum = 'N';
    }
    this._detalle.ConsultarDetalle(resum, this.data.sscc).subscribe((resp) => {
      console.log('DETALLE', resp);
      console.log('DETALLE', resp.Dt.Table);
       this.rows = resp.Dt.Table;
      /*this.codigo = tablex[0]["Cod"];
      this.talla = tablex[0]["Talla"];
      this.Descri = tablex[0]["Descri"];
      this.Lote = tablex[0]["Lote"];
      this.Total = tablex[0]["Master"];
      this.Pallet = tablex[0][""];
      this.saldo = tablex[0]["Saldo"];
      this.bodega = tablex[0]["sscc_Bodega"];*/
    });

    
  }

  ngOnInit() {
  }

   onClickRow(row) {
    console.log('mi row',row.Lote);
    this.codigo = row.Cod;
    this.talla = row.Talla;
    this.Descri = row.Descri;
    this.Lote = row.Lote;
    this.Total = row.Master;
    this.saldo = row.Saldo;
    this.bodega = row.sscc_Bodega;
  
  }

  onImprimeBarra() {
    this._detalle.imprimirpall(this.data.sscc);
  }

  imprime() {
    
  }

  imprime2() {
    
  }
}

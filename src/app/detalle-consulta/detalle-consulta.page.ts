import { subscribeOn } from 'rxjs/operators';
import { DetalleConsultaService } from './detalle-consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SaldosGlobal } from '../interfaces/interfaces';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-consulta',
  templateUrl: './detalle-consulta.page.html',
  styleUrls: ['./detalle-consulta.page.scss'],
})
export class DetalleConsultaPage implements OnInit {
  rows = [];
  saldos = [];
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
  totalcant: string;
  copias: string = "2";
  primero = false;
  segundo = true;
  tal_codigo: string;
  loading :any = this.loadingController.create();
  constructor(private route: ActivatedRoute,
    private router: Router, private _detalle: DetalleConsultaService,
    public loadingController: LoadingController,) {
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
    this.loading = this.presentLoading('Cargando');
    this._detalle.ConsultarDetalle(resum, this.data.sscc).subscribe((resp) => {
      this.loading.dismiss();
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

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return  this.loading.present();
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
     this.totalcant = row.Master;
     this.tal_codigo = row.tal_codigo
  
  }

  onImprimeBarra() {
    if (this.Pallet == '') {
      this._detalle.imprimirpall(this.Pallet);
    } else {
      this._detalle.imprimirpall(this.data.sscc);
    }
   
  }

  imprime() {
    
  }

  imprime2() {
    
  }

  onPopUp() {
    this.primero = true;
    this.segundo = false;
    this._detalle.SaldosTallas(this.codigo, this.Lote, this.tal_codigo, '1').subscribe((resp) => {
       this.saldos = resp.Dt.Table;
    });
  }
  salir() {
    this.primero = false;
    this.segundo = true;
  }

  Transf() {
    
  }
}

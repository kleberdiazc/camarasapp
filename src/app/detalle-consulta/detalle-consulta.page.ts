import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SaldosGlobal } from '../interfaces/interfaces';

@Component({
  selector: 'app-detalle-consulta',
  templateUrl: './detalle-consulta.page.html',
  styleUrls: ['./detalle-consulta.page.scss'],
})
export class DetalleConsultaPage implements OnInit {
  rows: SaldosGlobal[] = [];
  columns = [];
  total: number = 0;
  sscc: string;
  resumido: boolean;
  consulta: string;
  data: any;
  tipo:string = "CAJA"
  constructor(private route:ActivatedRoute,private router:Router) {
    this.columns = [
      { prop: 'CODIGO',name: 'CODIGO'},
      { prop: 'DESCRIPCION', name:'DESCRIPCION' },
      { prop: 'MASTER', name: 'MASTER' },
      { prop: 'LIBRAS', name: 'LIBRAS' },
    ]
    if (this.router.getCurrentNavigation().extras.state) {
      console.log(this.router.getCurrentNavigation().extras.state.sscc)
      this.data = this.router.getCurrentNavigation().extras.state.sscc;
      if (this.data.substring(0, 9) == '786115922' || this.data.substring(0, 9) == '786120672') {
          this.tipo = "CAJA"
        }
      if (this.data.substring(0, 9) == '786115923' || this.data.substring(0, 9) == '786120673') {
        this.tipo = "MASTER"
        }
      
    }
  }

  ngOnInit() {
  }

}

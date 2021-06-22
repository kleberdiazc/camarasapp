import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { SaldoGlobalPage } from './saldo-global.page';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



const saldoGlobalRoutes: Routes = [
  {
    path: '',
    component: SaldoGlobalPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(saldoGlobalRoutes),
    NgxDatatableModule
  ],
  declarations: [SaldoGlobalPage]
})
export class SaldoGlobalPageModule {}

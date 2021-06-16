import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { ConsultasSsccPage } from './consultas-sscc.page';
import { RouterModule, Routes } from '@angular/router';

const SsccRoutes: Routes = [
  {
    path: '',
    component: ConsultasSsccPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(SsccRoutes),
  ],
  declarations: [ConsultasSsccPage]
})
export class ConsultasSsccPageModule {}

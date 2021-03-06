import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { ConsultasSsccPage } from './consultas-sscc.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';

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
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(SsccRoutes),
    ComponentsModule
  ],
  declarations: [ConsultasSsccPage]
})
export class ConsultasSsccPageModule {}

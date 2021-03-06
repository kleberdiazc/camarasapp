import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ConsultaSSCCPage } from './consulta-sscc.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';



const SsccRoutes: Routes = [
  {
    path: '',
    component: ConsultaSSCCPage
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
  declarations: [ConsultaSSCCPage],

})
export class ConsultaSSCCPageModule {}

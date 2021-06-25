import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ConsultTransacPage } from './consult-transac.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


const routes: Routes = [
  {
    path: '',
    component: ConsultTransacPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NgxDatatableModule
  ],
  declarations: [ConsultTransacPage]
})
export class ConsultTransacPageModule {}

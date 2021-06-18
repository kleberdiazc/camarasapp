import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { DetalleConsultaPage } from './detalle-consulta.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



const routes: Routes = [
  {
    path: '',
    component: DetalleConsultaPage,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NgxDatatableModule
  ],
  declarations: [DetalleConsultaPage]
})
export class DetalleConsultaPageModule {}

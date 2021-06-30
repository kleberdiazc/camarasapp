import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


import { ReqEtiqueteoPage } from './req-etiqueteo.page';


const ReqEtiqueteoRoutes: Routes = [
  {
    path: '',
    component: ReqEtiqueteoPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(ReqEtiqueteoRoutes),
    NgxDatatableModule,
    ComponentsModule
  ],
  declarations: [ReqEtiqueteoPage]
})
export class ReqEtiqueteoPageModule { }

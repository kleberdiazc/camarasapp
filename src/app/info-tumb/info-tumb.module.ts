import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { InfoTumbPage } from './info-tumb.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


const inforoute: Routes = [
  {
    path: '',
    component: InfoTumbPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(inforoute),
    ComponentsModule,
    NgxDatatableModule
  ],
  declarations: [InfoTumbPage]
})
export class InfoTumbPageModule {}

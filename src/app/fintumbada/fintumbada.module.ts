import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FintumbadaPage } from './fintumbada.page';


const FintumbadaPageRoutes: Routes = [
  {
    path: '',
    component: FintumbadaPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(FintumbadaPageRoutes),
    NgxDatatableModule,
    ComponentsModule
  ],
  declarations: [FintumbadaPage]
})
export class FintumbadaPageModule { }


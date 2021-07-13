import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SaldosPage } from './saldos.page';
import { RouterModule, Routes } from '@angular/router';

const SaldosRoutes: Routes = [
  {
    path: '',
    component: SaldosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(SaldosRoutes),
    NgxDatatableModule,
    ComponentsModule
  ],
  declarations: [SaldosPage]
})
export class SaldosPageModule {}

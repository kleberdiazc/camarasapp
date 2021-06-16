import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { TransaccionesPage } from './transacciones.page';

const TransaccionesRoutes: Routes = [
  {
    path: '',
    component: TransaccionesPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(TransaccionesRoutes),
    ComponentsModule
  ],
  declarations: [TransaccionesPage]
})
export class TransaccionesPageModule {}

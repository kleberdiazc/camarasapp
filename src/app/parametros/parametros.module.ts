import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParametrosPage } from './parametros.page';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
const routes: Routes = [
  {
    path: '',
    component: ParametrosPage
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
  ],
  declarations: [ParametrosPage]
})
export class ParametrosPageModule {}

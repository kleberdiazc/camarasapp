import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { SuministrosPage } from './suministros.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
const routes: Routes = [
  {
    path: '',
    component: SuministrosPage
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
  declarations: [SuministrosPage]
})
export class SuministrosPageModule {}

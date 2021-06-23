import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemperaturaPage } from './temperatura.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../components/components.module';


const Temperatura: Routes = [
  {
    path: '',
    component: TemperaturaPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(Temperatura),
    ComponentsModule
  ],
  declarations: [TemperaturaPage]
})
export class TemperaturaPageModule {}

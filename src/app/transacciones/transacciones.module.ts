import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TransaccionesPage } from './transacciones.page';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

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
    NgxDatatableModule,
    ComponentsModule,
    AutocompleteLibModule
  ],
  declarations: [TransaccionesPage]
})
export class TransaccionesPageModule { }

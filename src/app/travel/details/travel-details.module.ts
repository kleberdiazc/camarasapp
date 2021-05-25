import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { TravelService } from '../travel.service';
import { TravelDetailsPage } from './travel-details.page';
import { TravelDetailsResolver } from './travel-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: TravelDetailsPage,
    resolve: {
      data: TravelDetailsResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [
    TravelDetailsPage
  ],
  providers: [
    TravelDetailsResolver,
    TravelService
  ]
})
export class TravelDetailsPageModule {}

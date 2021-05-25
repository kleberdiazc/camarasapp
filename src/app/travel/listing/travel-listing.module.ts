import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { TravelService } from '../travel.service';
import { TravelListingPage } from './travel-listing.page';
import { TravelListingResolver } from './travel-listing.resolver';

const routes: Routes = [
  {
    path: '',
    component: TravelListingPage,
    resolve: {
      data: TravelListingResolver
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
    TravelListingPage
  ],
  providers: [
    TravelListingResolver,
    TravelService
  ]
})
export class TravelListingPageModule {}

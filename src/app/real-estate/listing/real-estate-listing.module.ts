import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { RealEstateService } from '../real-estate.service';
import { RealEstateListingPage } from './real-estate-listing.page';
import { RealEstateListingResolver } from './real-estate-listing.resolver';

const routes: Routes = [
  {
    path: '',
    component: RealEstateListingPage,
    resolve: {
      data: RealEstateListingResolver
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
    RealEstateListingPage
  ],
  providers: [
    RealEstateListingResolver,
    RealEstateService
  ]
})
export class RealEstateListingPageModule {}

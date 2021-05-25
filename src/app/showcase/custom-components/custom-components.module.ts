import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../components/components.module';
import { CustomComponentsPage } from './custom-components.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomComponentsPage
      }
    ])
  ],
  declarations: [
    CustomComponentsPage
  ]
})
export class CustomComponentsModule {}

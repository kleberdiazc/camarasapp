import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';

import { WalkthroughPage } from './walkthrough.page';
import { WalkthroughGuard } from './walkthrough.guard';

const routes: Routes = [
  {
    path: '',
    component: WalkthroughPage,
    canActivate: [WalkthroughGuard]
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
  declarations: [WalkthroughPage],
  providers: [WalkthroughGuard]
})
export class WalkthroughPageModule {}

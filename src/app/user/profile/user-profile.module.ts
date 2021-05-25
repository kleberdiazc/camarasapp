import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { UserService } from '../user.service';
import { UserProfilePage } from './user-profile.page';
import { UserProfileResolver } from './user-profile.resolver';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
    resolve: {
      data: UserProfileResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserProfilePage],
  providers: [
    UserProfileResolver,
    UserService
  ]
})
export class UserProfilePageModule {}

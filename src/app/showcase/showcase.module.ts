import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';

const showcaseRoutes: Routes = [
  {
    path: '',
    children: [
      // /showcase/ redirect
      {
        path: '',
        redirectTo: 'app-shell',
        pathMatch: 'full',
      },
      {
        path: 'custom-components',
        loadChildren: () => import('./custom-components/custom-components.module').then(m => m.CustomComponentsModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(showcaseRoutes),
    ComponentsModule
  ],
  declarations: [ ]
})
export class ShowcasePageModule {}

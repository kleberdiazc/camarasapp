import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'walkthrough',
    loadChildren: () => import('./walkthrough/walkthrough.module').then(m => m.WalkthroughPageModule)
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./getting-started/getting-started.module').then(m => m.GettingStartedPageModule)
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'auth/signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'forms-and-validations',
    loadChildren: () => import('./forms/validations/forms-validations.module').then(m => m.FormsValidationsPageModule)
  },
  {
    path: 'forms-filters',
    loadChildren: () => import('./forms/filters/forms-filters.module').then(m => m.FormsFiltersPageModule)
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
  {
    path: 'showcase',
    loadChildren: () => import('./showcase/showcase.module').then(m => m.ShowcasePageModule)
  },
  {
    path: 'firebase',
    redirectTo: 'firebase/auth/sign-in',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },
  {
    path: 'detalle-consulta',
    loadChildren: () => import('./detalle-consulta/detalle-consulta.module').then( m => m.DetalleConsultaPageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { ConsultaSSCCPage } from './../consulta-sscc/consulta-sscc.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // /app/ redirect
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
          },
          {
            path: 'fashion',
            loadChildren: () => import('../fashion/listing/fashion-listing.module').then(m => m.FashionListingPageModule)
          },
          {
            path: 'fashion/:productId',
            loadChildren: () => import('../fashion/details/fashion-details.module').then(m => m.FashionDetailsPageModule)
          },
          {
            path: 'food',
            loadChildren: () => import('../food/listing/food-listing.module').then(m => m.FoodListingPageModule)
          },
          {
            path: 'food/:productId',
            loadChildren: () => import('../food/details/food-details.module').then(m => m.FoodDetailsPageModule)
          },
          {
            path: 'travel',
            loadChildren: () => import('../travel/listing/travel-listing.module').then(m => m.TravelListingPageModule)
          },
          {
            path: 'travel/:productId',
            loadChildren: () => import('../travel/details/travel-details.module').then(m => m.TravelDetailsPageModule)
          },
          {
            path: 'deals',
            loadChildren: () => import('../deals/listing/deals-listing.module').then(m => m.DealsListingPageModule)
          },
          {
            path: 'deals/:productId',
            loadChildren: () => import('../deals/details/deals-details.module').then(m => m.DealsDetailsPageModule)
          },
          {
            path: 'real-estate',
            loadChildren: () => import('../real-estate/listing/real-estate-listing.module').then(m => m.RealEstateListingPageModule)
          },
          {
            path: 'real-estate/:productId',
            loadChildren: () => import('../real-estate/details/real-estate-details.module').then(m => m.RealEstateDetailsPageModule)
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: () => import('../user/profile/user-profile.module').then(m => m.UserProfilePageModule)
          },
          {
            path: 'friends',
            loadChildren: () => import('../user/friends/user-friends.module').then(m => m.UserFriendsPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'saldos',
        children: [
          {
            path: '',
            loadChildren: () => import('../saldos/saldos.module').then(m => m.SaldosPageModule)
          }
        ]
      },
      {
        path: 'consulta-sscc',
        children: [
          {
            path: '',
            loadChildren: () => import('../consulta-sscc/consulta-sscc.module').then(m => m.ConsultaSSCCPageModule)
          }
        ]
      },
      {
        path: 'saldo-global',
        children: [
          {
            path: '',
            loadChildren: () => import('../saldo-global/saldo-global.module').then(m => m.SaldoGlobalPageModule)
          }
        ]
      },
      {
        path: 'transacciones',
        children: [
          {
            path: '',
            loadChildren: () => import('../transacciones/transacciones.module').then(m => m.TransaccionesPageModule)
          }
        ]
      },

      {
        path: 'consultas-sscc',
        children: [
          {
            path: '',
            loadChildren: () => import('../consultas-sscc/consultas-sscc.module').then(m => m.ConsultasSsccPageModule)
          },
          {
            path: 'detalle-consulta',
            loadChildren: () => import('../detalle-consulta/detalle-consulta.module').then(m => m.DetalleConsultaPageModule)
          },
        ]
      },
      {
        path: 'temperatura',
        loadChildren: () => import('../temperatura/temperatura.module').then( m => m.TemperaturaPageModule)
      },
      {
        path: 'info-tumb',
        loadChildren: () => import('../info-tumb/info-tumb.module').then( m => m.InfoTumbPageModule)
      },
      {
        path: 'consult-transac',
        loadChildren: () => import('../consult-transac/consult-transac.module').then( m => m.ConsultTransacPageModule)
      },
      {
        path: 'detalle-pallet',
        loadChildren: () => import('../detalle-pallet/detalle-pallet.module').then( m => m.DetallePalletPageModule)
      }
    
    
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}

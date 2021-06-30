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
        path: 'transacciones',
        children: [
          {
            path: '',
            loadChildren: () => import('../transacciones/transacciones.module').then(m => m.TransaccionesPageModule)
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
        loadChildren: () => import('../temperatura/temperatura.module').then(m => m.TemperaturaPageModule)
      },
      {
        path: 'info-tumb',
        loadChildren: () => import('../info-tumb/info-tumb.module').then(m => m.InfoTumbPageModule)
      },
      {
        path: 'consult-transac',
        loadChildren: () => import('../consult-transac/consult-transac.module').then(m => m.ConsultTransacPageModule)
      },
      {
        path: 'detalle-pallet',
        loadChildren: () => import('../detalle-pallet/detalle-pallet.module').then(m => m.DetallePalletPageModule)
      },
      {
        path: 'suministros',
        loadChildren: () => import('../suministros/suministros.module').then(m => m.SuministrosPageModule)
      },
      {
        path: 'parametros',
        loadChildren: () => import('../parametros/parametros.module').then(m => m.ParametrosPageModule)
      },
      {
        path: 'req-etiqueteo',
        children: [
          {
            path: '',
            loadChildren: () => import('../req-etiqueteo/req-etiqueteo.module').then(m => m.ReqEtiqueteoPageModule)
          }
        ]
      }
      ,
      {
        path: 'fintumbada',
        children: [
          {
            path: '',
            loadChildren: () => import('../fintumbada/fintumbada.module').then(m => m.FintumbadaPageModule)
          }
        ]
      }

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class TabsPageRoutingModule { }

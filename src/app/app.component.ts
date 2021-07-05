import { LoginservicesService } from './login/loginservices.service';
import { AppServicesService } from './app-services.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Componente } from './interfaces/interfaces';

const { SplashScreen, Storage } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss'
  ]
})
export class AppComponent {
  selectedPath: string;
  componentes: Observable<Componente[]>;
  appPages = [
    {
      title: 'Categories',
      url: '/app/categories',
      ionicIcon: 'list-outline'
    },
    {
      title: 'Transacciones',
      url: '/app/transacciones',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Temperatura',
      url: '/app/temperatura',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Req. Etiqueteo',
      url: '/app/req-etiqueteo',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Fin Tumbada',
      url: '/app/fintumbada',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Suministros',
      url: '/app/suministros',
      ionicIcon: 'person-outline'
    },
  ];
  accountPages = [
    {
      title: 'Log In',
      url: '/auth/login',
      ionicIcon: 'log-in-outline'
    }
  ];
  consultas = [
    {
      title: 'Saldos',
      url: '/app/saldos',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Consulta SSCC',
      url: '/app/consulta-sscc',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Saldo Global',
      url: '/app/saldo-global',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Consultas SSCC',
      url: '/app/consultas-sscc',
      ionicIcon: 'person-outline'
    },
    {
      title: 'Info Tumbada',
      url: '/app/info-tumb',
      ionicIcon: 'person-outline'
    }
    ,
    {
      title: 'Consulta Transacción',
      url: '/app/consult-transac',
      ionicIcon: 'person-outline'
    }
    ,
    {
      title: 'Detalle Pallet',
      url: '/app/detalle-pallet',
      ionicIcon: 'person-outline'
    },
   
    {
      title: 'Parametros',
      url: '/app/parametros',
      ionicIcon: 'person-outline'
    }
  ];


  constructor(private menServi: AppServicesService,
    private router: Router,
    private _login: LoginservicesService) {
    this.initializeApp();
    console.log('INICIE');
  }

  async initializeApp() {
    try {
      //this.appPages = this.menServi.getAll();
      console.log(this.appPages);
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }
  /* ngOnInit() {
     this.appPages = this.menServi.getAll();
     console.log(this.appPages);
     console.log('INICIE');
   }
   ionViewWillEnter() {
     this.appPages = this.menServi.getAll();
     console.log(this.appPages);
     console.log('INICIE');
 
   }
 */


  openTutorial() {
    // save key to mark the walkthrough as NOT visited because the user wants to check it out
    Storage.set({
      key: 'visitedWalkthrough',
      value: 'false'
    });
    this.router.navigateByUrl('walkthrough');
  }
}

/*appPages = [
  {
    title: 'Categories',
    url: '/app/categories',
    ionicIcon: 'list-outline'
  },
  {
    title: 'Profile',
    url: '/app/user',
    ionicIcon: 'person-outline'
  },
  {
    title: 'Contact Card',
    url: '/contact-card',
    customIcon: './assets/custom-icons/side-menu/contact-card.svg'
  },
  {
    title: 'Notifications',
    url: '/app/notifications',
    ionicIcon: 'notifications-outline'
  }
  ];*/


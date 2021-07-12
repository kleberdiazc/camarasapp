import { LoginservicesService } from './login/loginservices.service';
import { AppServicesService } from './app-services.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { NavController, MenuController } from '@ionic/angular';
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
      title: 'Transacciones',
      url: '/app/transacciones',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Temperatura',
      url: '/app/temperatura',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Req. Etiqueteo',
      url: '/app/req-etiqueteo',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Fin Tumbada',
      url: '/app/fintumbada',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Suministros',
      url: '/app/suministros',
      ionicIcon: 'caret-forward-outline'
    },
  ];
  accountPages = [
    {
      title: 'Log Out',
      url: '/auth/login',
      ionicIcon: 'log-in-outline',
      pathMatch: 'full'
    }
  ];

  config = [
    {

      title: 'Parametros',
      url: '/app/parametros',
      ionicIcon: 'construct-outline'

    }
  ];

  home = [
    {
      title: 'Inicio',
      url: '/app/categories',
      ionicIcon: 'Home-outline'
    }
  ];

  consultas = [
    {
      title: 'Saldos',
      url: '/app/saldos',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Saldo Global',
      url: '/app/saldo-global',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Consultas SSCC',
      url: '/app/consultas-sscc',
      ionicIcon: 'caret-forward-outline'
    },
    {
      title: 'Info Tumbada',
      url: '/app/info-tumb',
      ionicIcon: 'caret-forward-outline'
    }
    ,
    {
      title: 'Consulta Transacción',
      url: '/app/consult-transac',
      ionicIcon: 'caret-forward-outline'
    }
    ,
    {
      title: 'Detalle Pallet',
      url: '/app/detalle-pallet',
      ionicIcon: 'caret-forward-outline'
    }


  ];

  user: string = "";
  constructor(private menServi: AppServicesService,
    private router: Router,
    private _login: LoginservicesService,
    private navCtrl: NavController,
    private menu: MenuController) {
    this.initializeApp();


  }



  async onTitleChange(e) {
    //console.log(this._login.getuser());
    this.user = await this._login.getuser();
  }

  async initializeApp() {
    try {
      //this.appPages = this.menServi.getAll();
      this.user = await this._login.getuser();
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

  async cerrarSesion() {
    this._login.cerrar_sesion();
    //this.router.navigate(['/'], { state: { updateInfos: true } });
    //debugger;
    this.menu.enable(false);
    this.navCtrl.navigateRoot(['/']);
    //this.router.navigateByUrl('/');
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
    ionicIcon: 'caret-forward-outline'
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


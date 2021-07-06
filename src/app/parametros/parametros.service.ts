import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';


const { SplashScreen, Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  resumido: string;
  oculta: string;
  inventario: string;
  mac: string;

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform) {
    //this.init(),
    /* this.cargarStorage(); */
  }



  private async guardar_Storage() {
    /* if (this.platform.is('cordova')) { */

    await Storage.set({
      key: 'resumido',
      value: this.resumido
    });
    await Storage.set({
      key: 'oculta',
      value: this.oculta
    });
    await Storage.set({
      key: 'inventario',
      value: this.inventario
    });

    await Storage.set({
      key: 'mac',
      value: this.mac
    });

    /*this.storage.set('resumido', this.resumido);
    this.storage.set('oculta', this.oculta);
    this.storage.set('inventario', this.inventario);*/
    /* } else {
      if (this.resumido) {
        localStorage.setItem('resumido', this.resumido);
        localStorage.setItem('oculta', this.oculta);
        localStorage.setItem('inventario', this.inventario);
      } else {
        localStorage.removeItem('resumido');
        localStorage.removeItem('oculta');
        localStorage.removeItem('inventario');
      }

    } */
  }


  async ingresar(mac: string, resumido: boolean, oculta: boolean, inventario: boolean) {
    // tslint:disable-next-line:prefer-const

    /* this.resumido = resumido.toString();
    this.oculta = oculta.toString();
    this.inventario = inventario.toString();
    this.mac = mac;
    console.log(resumido.toString());
    this.guardar_Storage();
    this.cargarStorage(); */
    console.log("mac " + mac);

    await Storage.set({
      key: 'resumido',
      value: resumido.toString()
    });
    await Storage.set({
      key: 'oculta',
      value: oculta.toString()
    });
    await Storage.set({
      key: 'inventario',
      value: inventario.toString()
    });

    await Storage.set({
      key: 'mac',
      value: mac
    });

  }

  private cargarStorage() {
    let promesa = new Promise<void>(async (resolve, reject) => {
      if (this.platform.is('cordova')) {

        await Storage.get({ key: 'resumido' }).then(resumido => {
          if (resumido) {
            this.resumido = resumido.value;
            console.log("ENTREEEE RESUMIDOOO")
          }
        });

        await Storage.get({ key: 'oculta' }).then(oculta => {
          if (oculta) {
            this.oculta = oculta.value;
            console.log("ENTREEEE oculta")
          }
        });

        await Storage.get({ key: 'inventario' }).then(inventario => {
          if (inventario) {
            this.inventario = inventario.value;
            console.log("ENTREEEE inventario")
          }
        });

        await Storage.get({ key: 'mac' }).then(mac => {
          if (mac) {
            this.mac = mac.value;
          }
        });


        /* await this.storage.get('resumido')
         .then(resumido => {
          if (resumido) {
            this.resumido = resumido;
            console.log("ENTREEEE RESUMIDOOO")
          }
         });
         await this.storage.get('oculta')
           .then(oculta => {
             if (oculta) {
               this.oculta = oculta;
             }
           });
         await this.storage.get('inventario')
           .then(inventario => {
            if (inventario) {
              this.inventario = inventario;
            }
           });
           await this.storage.get('mac')
           .then(mac => {
            if (mac) {
              this.mac = mac;
            }
           });*/
      }

      else {
        if (localStorage.getItem('token')) {
          this.resumido = localStorage.getItem('resumido');
          this.oculta = localStorage.getItem('oculta');
          this.inventario = localStorage.getItem('inventario');
          this.mac = localStorage.getItem('mac');
        }
        resolve();
        console.log('Cagar datos' + this.resumido);
        //return promesa;
      }
    }).then();
    //promesa.then();

  }

  async getvaluesResumido() {
    const v = await Storage.get({ key: "resumido" });
    return v.value;
    //return this.resumido;
  }
  async getvaluesOculta() {
    const v = await Storage.get({ key: "oculta" });
    return v.value;
    //return this.oculta;
  }
  async getvaluesInventario() {
    const v = await Storage.get({ key: "inventario" });
    return v.value;
    //return this.inventario;
  }
  async getvaluesMac() {
    const v = await Storage.get({ key: "mac" });
    return v.value;
    //return this.mac;
  }
}


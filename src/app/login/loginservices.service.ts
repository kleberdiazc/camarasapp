import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { SplashScreen, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LoginservicesService {
  token: string;
  id_usuario: string;
  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { this.cargarStorage(); }

  loading: any = null;
  async presentAlert(Header, Mensaje) {

    this.hideLoading();
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: Header,
        message: Mensaje,
        buttons: [{
          text: 'OK',
          handler: () => {
            return resolve(true);
          },
        }]
      });

      await alert.present();
    });
  }

  async showLoading(mensaje) {

    return new Promise(async (resolve) => {
      this.loading = await this.loadingController.create({
        message: mensaje,
        translucent: true,
        cssClass: 'custom-class custom-loading',
      });
      await this.loading.present();
      return resolve(true);
    });
  }

  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }

  getIngreso(Usuario: string, contrasena: string) {
    let contra = this.encrypt(contrasena.toUpperCase(), 2);

    const ListParam = [{ "Name": "user", "Type": "VarChar", "Value": Usuario },
    { "Name": "pass", "Type": "VarChar", "Value": contra }];

    const base = {
      sp: 'sp_login_user',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post('https://web.songa.com/api/Consult', base).pipe(map(async (resp: any) => {
      await this.showLoading("Cargando...");
      if (resp.Codigo) {
        if (Object.keys(resp.Dt).length > 0) {
          let dt: [][] = resp.Dt.Table;
          if (dt.length > 0) {
            if (dt[0]["error"].toString() === 'true') {
              this.presentAlert("Error", dt[0]["mensaje"].toString());

            } else {
              this.hideLoading();
              this.token = dt[0]["token"].toString();
              this.id_usuario = dt[0]["usuario"].toString();
              this.guardar_Storage();
              this.cargarStorage();
            }
          }
        }
      } else {
        this.presentAlert("Error", resp.Description);
      }
      this.hideLoading();
    }));
  }

  /* ingresar(Usuario: string, contrasena: string) {
    // tslint:disable-next-line:prefer-const
    let contra = this.encrypt(contrasena.toUpperCase(), 2);
    let data = {
      sp: 'sp_login_user',
      parameters: 'user:' + Usuario + ':Varchar|pass:' + contra + ':Varchar|',
      connection: 'PRODUCCION'
    };
    return this.http.post('https://web.songa.com/api/Consultas', data).pipe(map(async (resp: any) => {
      if (resp[0].error === 'true') {
        const alert = await this.alertController.create({
          header: 'Error!',
          message: resp[0].mensaje,
          buttons: ['OK']
        });
        await alert.present();
      } else {
        this.token = resp[0].token;
        this.id_usuario = resp[0].usuario;
        this.guardar_Storage();
        this.cargarStorage();
      }
    }));

  } */
  async activo() {
    //debugger;
    console.log('log' + this.id_usuario);
    await this.cargarStorage();
    if (this.id_usuario) {
      return true;
    } else {
      return false;
    }
  }

  private async guardar_Storage() {
    if (this.platform.is('cordova')) {
      await Storage.set({
        key: 'token',
        value: this.token
      });
      await Storage.set({
        key: 'id_usuario',
        value: this.id_usuario
      });
    } else {
      if (this.token) {
        localStorage.setItem('token', this.token);
        localStorage.setItem('id_usuario', this.id_usuario);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('id_usuario');
      }

    }
  }

  private cargarStorage() {
    let promesa = new Promise<void>(async (resolve, reject) => {
      if (this.platform.is('cordova')) {
        await Storage.get({ key: 'token' }).then(token => {
          if (token) {
            this.token = token.value;
          }
        });
        await Storage.get({ key: 'id_usuario' }).then(id_usuario => {
          if (id_usuario) {
            this.id_usuario = id_usuario.value;
          }
        });
      }

      else {
        if (localStorage.getItem('token')) {
          this.token = localStorage.getItem('token');
          this.id_usuario = localStorage.getItem('id_usuario');
        }
        resolve();
        console.log('Cragar Usuario' + this.id_usuario);
        //return promesa;
      }
    }).then();
    //promesa.then();

  }
  cerrar_sesion() {
    this.token = null;
    this.id_usuario = null;
    this.guardar_Storage();
  }

  encrypt(Cadena: string, key: number) {
    try {
      let Cad = '';
      let tamaño;
      let Encriptado = '';
      let caracter;
      let i: number;

      Cad = Cadena.trim();
      console.log('Cadena' + Cad);
      tamaño = Cad.length;
      for (i = 1; i <= tamaño; i++) {
        caracter = this.Asc(Cad.substring((i - 1), i)) + key;
        Encriptado = Encriptado + String.fromCharCode(caracter);
      }

      return Encriptado;
    } catch (error) {
    }
  }

  Asc(cadena: string) {
    const cad = cadena.substring(0, 1).charCodeAt(0);
    return cad;
  }

  getuser() {
    return this.id_usuario;
  }

}

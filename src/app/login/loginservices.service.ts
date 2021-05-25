import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';





@Injectable({
  providedIn: 'root'
})
export class LoginservicesService {
  token:string;
  id_usuario:string;
  constructor(private http: HttpClient,
              public alertController: AlertController,
              public platform: Platform,
              private storage: Storage) { this.cargarStorage(); }
   ingresar(correo: string, contrasena: string) {
    // tslint:disable-next-line:prefer-const
    let contra = this.encrypt(contrasena.toUpperCase(), 2);
    let data = { 
      sp: 'sp_login_user',
      parameters : 'user:' + correo + ':Varchar|pass:' + contra + ':Varchar|',
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

  }
  activo(): boolean {
    //debugger;
    console.log('log' + this.id_usuario);
    this.cargarStorage();
    if (this.id_usuario) {
      return true;
    } else {
      return false;
    }
  }

  private guardar_Storage() {
    if (this.platform.is('cordova'))  {
      this.storage.set('token', this.token);
      this.storage.set('id_usuario', this.id_usuario);
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
    let promesa = new Promise<void>(( resolve , reject) => {
      if(this.platform.is('cordova')) {
        this.storage.get('token')
        .then(token => {
         if (token) {
           this.token = token;
         }
        });
        this.storage.get('id_usuario')
          .then(id_usuario => {
            if (id_usuario) {
              this.id_usuario = id_usuario;
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

  encrypt(Cadena: string, key: number ){
    try {
      let Cad = '';
      let tamaño;
      let Encriptado = '';
      let caracter;
      let i: number;

      Cad = Cadena.trim();
      console.log('Cadena' + Cad);
      tamaño = Cad.length;
      for ( i = 1; i <= tamaño; i++)
      {
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

  getuser(){
    return this.id_usuario;
  }

}

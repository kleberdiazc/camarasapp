import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { ResultWS } from './../interfaces/interfaces';
import { Console } from 'console';

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
    public loadingController: LoadingController) { }



  getIngreso2(Usuario: string, contrasena: string) {
    let contra = this.encrypt(contrasena.toUpperCase(), 2);

    const ListParam = [{ "Name": "user", "Type": "VarChar", "Value": Usuario },
    { "Name": "pass", "Type": "VarChar", "Value": contra }];

    const base = {
      sp: 'sp_login_user',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post<ResultWS>('https://web.songa.com/api/Consult', base);
  }


  async cerrar_sesion() {
    this.token = null;
    this.id_usuario = null;

    await Storage.remove({ key: 'token' });
    await Storage.remove({ key: 'usuario' });

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



  async getuser() {
    const v = await Storage.get({ key: "usuario" });

    return v.value;

  }

  getuserOld() {

    return this.id_usuario;
  }

}

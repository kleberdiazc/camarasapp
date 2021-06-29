import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  resumido:string;
  oculta: string;
  inventario: string;
  mac: string;
  constructor(private http: HttpClient,
              public alertController: AlertController,
              public platform: Platform,
    private storage: Storage) { this.cargarStorage(); }
  
  
  
  
  
    private guardar_Storage() {
      if (this.platform.is('cordova'))  {
        this.storage.set('resumido', this.resumido);
        this.storage.set('oculta', this.oculta);
        this.storage.set('inventario', this.inventario);
      } else {
        if (this.resumido) {
          localStorage.setItem('resumido', this.resumido);
          localStorage.setItem('oculta', this.oculta);
          localStorage.setItem('inventario', this.inventario);
        } else {
          localStorage.removeItem('resumido');
          localStorage.removeItem('oculta');
          localStorage.removeItem('inventario');
        }
  
      }
    }
  
  
    ingresar(mac:string,resumido: boolean, oculta: boolean,inventario:boolean) {
      // tslint:disable-next-line:prefer-const

      this.resumido = resumido.toString();
      this.oculta = oculta.toString();
      this.inventario = inventario.toString();
      this.mac = mac;
      console.log(resumido.toString());
     this.guardar_Storage();
     this.cargarStorage();

  
    }
  
    private cargarStorage() {
      let promesa = new Promise<void>(( resolve , reject) => {
        if(this.platform.is('cordova')) {
          this.storage.get('resumido')
          .then(resumido => {
           if (resumido) {
             this.resumido = resumido;
           }
          });
          this.storage.get('oculta')
            .then(oculta => {
              if (oculta) {
                this.oculta = oculta;
              }
            });
            this.storage.get('inventario')
            .then(inventario => {
             if (inventario) {
               this.inventario = inventario;
             }
            });
            this.storage.get('mac')
            .then(mac => {
             if (mac) {
               this.mac = mac;
             }
            });
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
  
    getvaluesResumido() {
      return this.resumido;
    }
    getvaluesOculta() {
      return this.oculta;
    }
    getvaluesInventario() {
      return this.inventario;
    }
    getvaluesMac() {
      return this.mac;
    }
}


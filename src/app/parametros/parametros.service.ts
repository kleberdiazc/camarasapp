import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  resumido:string;
  oculta: string;
  inventario:string;
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
  
  
    ingresar(resumido: string, oculta: string,inventario:string) {
      // tslint:disable-next-line:prefer-const
     
          this.resumido = resumido;
          this.oculta = oculta;
          this.inventario = inventario;
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
          }
                  
          else {
         if (localStorage.getItem('token')) {
           this.resumido = localStorage.getItem('resumido');
           this.oculta = localStorage.getItem('oculta');
           this.inventario = localStorage.getItem('inventario');
         }
         resolve();
         console.log('Cagar datos' + this.resumido);
         //return promesa;
       }
      }).then();
      //promesa.then();
  
    }
}


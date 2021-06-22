import { SaldosGlobal } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { Saldos } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SaldoGlobalService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
    getListaSaldosGlobal(cod:string,talla:string) {
      let data = { 
        sp: 'spr_SaldoGlobal',
        parameters : 'BOD_CATEG:' + cod + ':Varchar|BIT_CODBOD:' + talla + ':Varchar|' ,
        connection: 'PRODUCCION'
      };
     
      return  this.http.post<SaldosGlobal[]>('https://web.songa.com/api/Consultas', data);
    }
}

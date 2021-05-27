import { Saldos } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SaldosService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
    getListaSaldos(cod:string,talla:number,lote:string) {
      let data = { 
        sp: 'SPR_ConSaldos',
        parameters : 'Cod:' + cod + ':Varchar|Talla:' + talla + ':int|Lote:' + lote
        + ':VARCHAR|',
        connection: 'PRODUCCION'
      };
     
      return  this.http.post<Saldos[]>('https://web.songa.com/api/Consultas', data);
    }
  
}


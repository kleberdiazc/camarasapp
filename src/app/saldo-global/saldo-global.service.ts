/* import { URL_CONSULTA } from './../../config/url.servicios'; */
import { SaldosGlobal, ResultWS } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { Saldos } from '../interfaces/interfaces';
import { URL_CONSULT, CONNECTION_PROD } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class SaldoGlobalService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }


  getListaSaldosGlobal(cod: string, talla: string) {

    const ListParam = [{ "Name": "BOD_CATEG", "Type": "Varchar", "Value": cod },
    { "Name": "BIT_CODBOD", "Type": "Varchar", "Value": talla }];

    const base = {
      sp: 'spr_SaldoGlobal',
      param: ListParam,
      conexion: CONNECTION_PROD
    };


    return this.http.post<ResultWS>(URL_CONSULT, base);
    /* return  this.http.post<SaldosGlobal[]>(URL_CONSULTA, data); */
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { ResultWS } from './../interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { URL_CONSULT } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class FintumbadaService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private storage: Storage) { }

  getDataInitial() {
    const ListParam = [];

    const base = {
      sp: 'SP_OBTIENECIERRE',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getDataCierre(cierre) {
    const ListParam = [{ "Name": "CIERRE", "Type": "VarChar", "Value": cierre }];

    const base = {
      sp: 'SP_DATACIERRESOB',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  GrabaFinCierre(cierre, user) {
    const ListParam = [{ "Name": "Cierre", "Type": "VarChar", "Value": cierre },
    { "Name": "usuario", "Type": "VarChar", "Value": user }];

    const base = {
      sp: 'sp_TransferirSobranteTunel',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

}

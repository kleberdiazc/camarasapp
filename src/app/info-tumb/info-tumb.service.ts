import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { URL_CONSULT, CONNECTION_PROD } from '../config/url.servicios';
import { RWEmbarques } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class InfoTumbService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }


  ConsultarCierres() {

    const ListParam = [];

    const base = {
      sp: 'sp_consultatuneles',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<RWEmbarques>(URL_CONSULT, base);
  }

  ConsultarDetallesCierre(numero: string) {

    const ListParam = [{ "Name": "num", "Type": "Varchar", "Value": numero }];

    const base = {
      sp: 'spr_InformeTumbada',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<RWEmbarques>(URL_CONSULT, base);
  }


}



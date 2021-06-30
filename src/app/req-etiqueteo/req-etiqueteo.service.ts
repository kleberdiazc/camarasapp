import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { ResultWS } from './../interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ReqEtiqueteoService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private storage: Storage) { }


  getDataInitial(planta, user) {
    const ListParam = [{ "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    { "Name": "USER", "Type": "Varchar", "Value": user }];

    const base = {
      sp: 'SP_CARGA_BODEGAORIGEN_SOB',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>('http://web.songa.com/songaapi/api/Consult', base);
  }

  getDataSSCC(sscc, planta, user) {
    const ListParam = [{ "Name": "SSCC", "Type": "VarChar", "Value": sscc },
    { "Name": "PLANTA", "Type": "VarChar", "Value": planta },
    { "Name": "USER", "Type": "VarChar", "Value": user }];

    const base = {
      sp: 'SP_SSCC_REQETIQUETEO',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };

    return this.http.post<ResultWS>('http://web.songa.com/songaapi/api/Consult', base);
  }


  GrabaMovimiento(xml, user, bodori) {
    const ListParam = [{ "Name": "XML", "Type": "Xml", "Value": xml },
    { "Name": "USER", "Type": "VarChar", "Value": user },
    { "Name": "BODORI", "Type": "VarChar", "Value": bodori }];

    const base = {
      sp: 'SP_GRABATRANSACC_ETIQ_CO',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };


    var formdata = new FormData();
    formdata.append("param", JSON.stringify(base));
    formdata.append("paramImagen", "{}");


    return this.http.post<ResultWS>('http://web.songa.com/songaapi/api/TransacImagen', formdata);
  }

}

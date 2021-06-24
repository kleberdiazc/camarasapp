import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
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
          conexion: 'PRODUCCION'
      };
     
      return this.http.post<RWEmbarques>('http://web.songa.com/songaapi/api/Consult', base);
    }
  
    ConsultarDetallesCierre(numero:string) {

      const ListParam = [{ "Name": "num", "Type": "Varchar", "Value": numero }];

      const base = {
          sp: 'spr_InformeTumbada',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      return this.http.post<RWEmbarques>('http://web.songa.com/songaapi/api/Consult', base);
    }
  
  
}



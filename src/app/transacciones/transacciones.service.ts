import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { ResultWS } from './../interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private storage: Storage) { }
  
  
    getDataInitial() {
      /* let data = { 
        sp: 'SPR_ConSaldos',
        parameters : 'Cod:' + cod + ':Varchar|Talla:' + talla + ':int|Lote:' + lote
        + ':VARCHAR|',
        connection: 'PRODUCCION'
      }; */
      const ListParam = [{"Name": "TIPO", "Type": "Varchar","Value": "TIPO"}];

      const base = {
          sp: 'SP_COMBOSTRANSACC_APP',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      return  this.http.post<ResultWS>('http://web.songa.com/songaapi/api/Consult', base);
    }

    getDataMotivo(mov){
      
      const ListParam = [{"Name": "TIPO", "Type": "Varchar","Value": "MOTIVO"},
                          {"Name": "MOV", "Type": "Varchar","Value": mov},
                          {"Name": "USUARIO", "Type": "Varchar","Value": "ADMINISTRA"/* this.storage.get('id_usuario') */}];

      const base = {
          sp: 'SP_COMBOSTRANSACC_APP',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      return  this.http.post<ResultWS>('http://web.songa.com/songaapi/api/Consult', base);
    }

    getDataChofer(Trans){
      
      const ListParam = [{"Name": "CODIGO", "Type": "Varchar","Value": Trans}];

      const base = {
          sp: 'SP_CARGACHOFER',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      return  this.http.post<ResultWS>('http://web.songa.com/songaapi/api/Consult', base);
    }
}

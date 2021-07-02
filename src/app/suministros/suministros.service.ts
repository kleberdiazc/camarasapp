import { URL_CONSULT } from './../config/url.servicios';
import { RWDetalleCons } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { RWCombosCons } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SuministrosService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
  ConsultarDatos(planta:string,user:string) {
    console.log(planta);
    const ListParam = [{ "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    { "Name": "USER", "Type": "Varchar", "Value": user },
    ];
    
    const base = {
      sp: 'SP_CARGA_DATATRANS_SUM',
      param: ListParam,
      conexion: 'PRODUCCION'
    };
    
    return this.http.post<RWCombosCons>('http://web.songa.com/songaapi/api/Consult', base);
  }


  ConsultarTransac(sello: string, item: string, cantidad: string, origen: string,
    destino: string, planta: string, usuario: string) {
    
    let cant: string = cantidad.toString();
    let items: string = item.toString();

    console.log(sello, item, cant, origen,
      destino, planta, usuario);
    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": "T" },
    { "Name": "SELLO", "Type": "Varchar", "Value": sello },
    { "Name": "ITEM", "Type": "Varchar", "Value": items },
    { "Name": "CANTIDAD", "Type": "Varchar", "Value": cant },
    { "Name": "BODORI", "Type": "Varchar", "Value": origen },
    { "Name": "BODDES", "Type": "Varchar", "Value": destino },
    { "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    { "Name": "USER", "Type": "Varchar", "Value": usuario }
    ];
    const base = {
      sp: 'SP_GRABA_TRANS_SUM',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };
    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }


  Imprimir(sello:string,tipo:string) {
    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": "T" },
    { "Name": "SELLO", "Type": "Varchar", "Value": sello },
    ];
    const base = {
      sp: 'sp_transSuminImpr',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };
    return this.http.post<RWDetalleCons>(URL_CONSULT, base);
  }

}

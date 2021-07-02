import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { URL_CONSULT } from '../config/url.servicios';
import { RWCombosCons, RWEmbarques, Valida } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConsultTransacService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
  ConsultarBodegas(planta:string) {
    console.log(planta);
    const ListParam = [{ "Name": "PLANTA", "Type": "Varchar", "Value": planta },
    ];
    
    const base = {
      sp: 'SP_COMBOS_SONGA',
      param: ListParam,
      conexion: 'PRODUCCION'
    };
    
    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }
 

  
  
  ConsultarTransac(bodega: string, user: string, tipo: string, desde: string,
    hasta: string, pros: string, trans: string) {
      console.log(bodega,user, tipo,desde,hasta,pros,trans);
    const ListParam = [{ "Name": "Bodega", "Type": "Varchar", "Value": bodega },
                        { "Name": "User", "Type": "Varchar", "Value": user },
                        { "Name": "Tipo", "Type": "Varchar", "Value": tipo },
                        { "Name": "Desde", "Type": "Varchar", "Value": desde },
                        { "Name": "Hasta", "Type": "Varchar", "Value": hasta },
                        { "Name": "Pros", "Type": "Varchar", "Value": pros },
                        { "Name": "Trans", "Type": "Varchar", "Value": trans }  
                        ];
    const base = {
      sp: 'SPR_TransBod',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    
    
    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }

  ResumenTransac(bodega: string, user: string, tipo: string, desde: string,
    hasta: string, pros: string, trans: string, lote: string, pedUsr) {
    
    console.log("tipo", tipo);
    const ListParam = [{ "Name": "Bodega", "Type": "Varchar", "Value": bodega },
                        { "Name": "User", "Type": "Varchar", "Value": user },
                        { "Name": "Tipo", "Type": "Varchar", "Value": tipo },
                        { "Name": "Desde", "Type": "Varchar", "Value": desde },
                        { "Name": "Hasta", "Type": "Varchar", "Value": hasta },
                        { "Name": "Pros", "Type": "Varchar", "Value": pros },
                        { "Name": "Trans", "Type": "Varchar", "Value": trans } , 
                        { "Name": "Lote", "Type": "Varchar", "Value": lote }  ,
                        { "Name": "PedUsr", "Type": "Varchar", "Value": pedUsr }  
                        ];
    const base = {
      sp: 'SPR_ResumenTransBod',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }

  DetalleTransac(NUMTRA: string) {
    let numero:string = ''+NUMTRA+''
    
    const ListParam = [{ "Name": "tran", "Type": "Varchar", "Value": numero }, 
                        ];
    const base = {
      sp: 'spr_dettrans',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    
    
    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }

}

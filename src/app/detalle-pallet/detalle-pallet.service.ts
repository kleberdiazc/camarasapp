import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { URL_CONSULT } from '../config/url.servicios';
import { Valida, RWDetalleCons, RWCombosCons } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DetallePalletService {


  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
    ConsultarDetallePallet(sscc:string) {

      const ListParam = [{ "Name": "codigo", "Type": "Varchar", "Value": sscc }
                      ];

      const base = {
          sp: 'SPR_DetPallet',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      console.log(sscc)
      return this.http.post<RWDetalleCons>(URL_CONSULT, base);
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

  getTransac(NUMTRA: string) {
    let numero:string = ''+NUMTRA+''
    
    const ListParam = [{ "Name": "tran", "Type": "Varchar", "Value": numero }, 
                        ];
    const base = {
      sp: 'sp_gettransac',
      param: ListParam,
      conexion: 'PRODUCCION'
    };

    
    
    return this.http.post<RWCombosCons>(URL_CONSULT, base);
  }

  
}

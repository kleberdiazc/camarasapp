import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { Valida, RWDetalleCons } from '../interfaces/interfaces';

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
      return this.http.post<RWDetalleCons>('http://web.songa.com/songaapi/api/Consult', base);
    }
}

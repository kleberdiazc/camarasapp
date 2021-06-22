import { RWDetalleCons } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { SaldosGlobal, Valida } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DetalleConsultaService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
    ValidarConsulta(consulta:string,sscc:string) {

      const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": consulta },
                         { "Name": "SSCC", "Type": "Varchar", "Value": sscc }
                      ];

      const base = {
          sp: 'SP_CONSULTA_GEN',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      return this.http.post<Valida>('http://web.songa.com/songaapi/api/Consult', base);
    }
  
  
    ConsultarDetalle(resumido:string,sscc:string) {

      const ListParam = [{ "Name": "codigo", "Type": "Varchar", "Value": sscc },
                         { "Name": "resumido", "Type": "Varchar", "Value": resumido }
                      ];

      const base = {
          sp: 'spr_ConsultarDetallenew',
          param: ListParam,
          conexion: 'PRODUCCION'
      };
     
      console.log(resumido,sscc)
      return this.http.post<RWDetalleCons>('http://web.songa.com/songaapi/api/Consult', base);
    }
}

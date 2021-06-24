import { Embarques, RWEmbarques, Valida } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TemperaturaService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
    ConsultarFacturas() {

      const ListParam = [];

      const base = {
          sp: 'sp_obtieneEmbarques',
          param: ListParam,
          conexion: 'DESAPRODUCCION'
      };
     
      return this.http.post<RWEmbarques>('http://web.songa.com/songaapi/api/Consult', base);
    }
  
  GrabarFactura(tipo: string, cierre: string, factura: string, temp: string, sscc: string, user: string) {
    console.log(tipo, cierre, factura, temp, sscc, user);
    const ListParam = [{ "Name": "tem_tipo", "Type": "Varchar", "Value": tipo },
      { "Name": "tem_cierre", "Type": "Varchar", "Value": cierre },
      { "Name": "tem_factur", "Type": "Varchar", "Value": factura },
      { "Name": "tem_valor", "Type": "Varchar", "Value": temp },
      { "Name": "tem_sscc", "Type": "Varchar", "Value": sscc },
      { "Name": "tem_user", "Type": "Varchar", "Value": user }  
    ];
    
    const base = {
      sp: 'spr_InserTemperatura',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };
    
    return this.http.post<Valida>('http://web.songa.com/songaapi/api/Consult', base);
  }
 
  Imprimir(numsec:string,usuario:string) {
    const ListParam = [{ "Name": "TRC_NUMSEC", "Type": "Varchar", "Value": numsec },
      { "Name": "usuario", "Type": "Varchar", "Value": usuario },
    ];
    
    const base = {
      sp: 'spr_AgregarColaImpresionPallet',
      param: ListParam,
      conexion: 'DESAPRODUCCION'
    };
    
    return this.http.post<Valida>('http://web.songa.com/songaapi/api/Consult', base);
  }

}

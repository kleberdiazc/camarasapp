import { RWEmbarques, Saldos } from './../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { URL_CONSULT } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class SaldosService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController) { }
  
  
    getListaSaldos(cod:string,talla:number,lote:string) {
      let data = { 
        sp: 'SPR_ConSaldos',
        parameters : 'Cod:' + cod + ':Varchar|Talla:' + talla + ':int|Lote:' + lote
        + ':VARCHAR|',
        connection: 'PRODUCCION'
      };
     
      return  this.http.post<Saldos[]>('https://web.songa.com/api/Consultas', data);
    }
  
  ConsultarSaldos(Cod: string, Talla: string, Lote: string) {
  
    let codigo = Cod.toString();
    let lote = Lote.toString();
    if (Talla == "") {
      Talla = "0";
    } else {
      Talla = Talla.toString();
    }

    if (lote == "") {
      lote = "";
    }

    console.log(codigo, Talla, lote);
    const ListParam = [{ "Name": "Cod", "Type": "Varchar", "Value": codigo },
    { "Name": "Talla", "Type": "Varchar", "Value": Talla },
    { "Name": "Lote", "Type": "Varchar", "Value": Lote }
    ];
    const base = {
      sp: 'SPR_ConSaldos',
      param: ListParam,
      conexion: 'PRODUCCION'
    };
    return this.http.post<RWEmbarques>(URL_CONSULT, base);
  }
  
    ConsultarTallas() {

      const ListParam = [];
  
      const base = {
        sp: 'SPR_ExtraeTallas_WEB',
        param: ListParam,
        conexion: 'PRODUCCION'
      };
  
  
      return this.http.post<RWEmbarques>(URL_CONSULT, base);
    }
  
}


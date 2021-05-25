import { LoginservicesService } from './login/loginservices.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Componente } from './interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
  
export class AppServicesService {
  menuRes: Observable<Componente[]>;
  constructor(private http: HttpClient,
    public alertController: AlertController,
    public log: LoginservicesService) { }

  getAll() {
    let data = {
      sp: 'sp_menu_x_usuario_Camaras',
      parameters : 'user:' + this.log.id_usuario + ':Varchar|',
      connection: 'PRODUCCION'
    };
    const url = 'https://web.songa.com/api/Consultas';
   
  
    return  this.http.post<Componente[]>(url, data);
  }
}



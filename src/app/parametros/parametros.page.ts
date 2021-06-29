import { ParametrosService } from './parametros.service';
import { Component, OnInit } from '@angular/core';
import { ConsultaSsccService } from '../consulta-sscc/consulta-sscc.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.page.html',
  styleUrls: ['./parametros.page.scss'],
})
export class ParametrosPage implements OnInit {
  oculta: boolean = true;
  resumen: boolean = true;
  inventario: boolean = true;
  bluetoothList: any = [];
  mac: string = "";
  constructor(private _param: ParametrosService,
    private print: ConsultaSsccService,
    private alertController:AlertController) { }

  ngOnInit() {
    this.inventario = (this._param.getvaluesInventario() == 'true');
    this.oculta = (this._param.getvaluesOculta() == 'true');
    this.resumen = (this._param.getvaluesResumido() == 'true');
    this.mac = this._param.getvaluesMac();

  }

  ResumenChange() {
    console.log(this.resumen);
  }

  ocultaChange() {
    console.log(this.oculta);
  }


  inventarioChange() {
    console.log(this.inventario);
  }

  Grabar() {
    this._param.ingresar(this.mac,this.resumen, this.oculta, this.inventario);
  }

  
  listBTDevice()
  {
    this.print.searchBt().then(datalist=>{
      
      this.bluetoothList = datalist;
      

    },async err=>{
      console.log("ERROR",err);
      let mno= await this.alertController.create({
        header:"ERROR "+err,
        buttons:['Dismiss']
      });
      await mno.present();
    })

  }

}

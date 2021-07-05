import { ParametrosService } from './parametros.service';
import { Component, OnInit } from '@angular/core';
import { ConsultaSsccService } from '../consulta-sscc/consulta-sscc.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.page.html',
  styleUrls: ['./parametros.page.scss'],
})
export class ParametrosPage implements OnInit {
  oculta: boolean = false;
  resumen: boolean = false;
  inventario: boolean = false;
  bluetoothList: any = [];
  mac: string = "";
  compareWith : any ;
MyDefaultYearIdValue : string ;
  constructor(private _param: ParametrosService,
    private print: ConsultaSsccService,
    private alertController: AlertController,
    public loadingController: LoadingController) { }

  async ngOnInit() {
    this.listBTDevice();
    console.log("BRING DATA", )
    
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Un momento...',
        duration: 4000
      });
      await loading.present();
  
      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
  
    this.inventario = ( await this._param.getvaluesInventario() == 'true');
    this.oculta = (await  this._param.getvaluesOculta() == 'true');
    this.resumen = (await this._param.getvaluesResumido() == 'true');
    this.mac = await this._param.getvaluesMac();
    this.MyDefaultYearIdValue = this.mac;
    console.log('MAC', this.mac);
    this.compareWith = this.compareWithFn;
    //this.mac = this._param.getvaluesMac();


  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  ResumenChange() {
    console.log(this.resumen);
  }

  ocultaChange() {
    console.log(this.oculta);
  }


  inventarioChange() {
    console.log(this.inventario);
  }

   async Grabar() {
     this._param.ingresar(this.mac, this.resumen, this.oculta, this.inventario);
     let mno= await this.alertController.create({
      header:"Sucess "+"Guardado con Exito",
      buttons:['Ok']
    });
    await mno.present();

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

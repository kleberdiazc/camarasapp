import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConsultaSsccService {

  constructor(private btSerial: BluetoothSerial,private alertCtrl:AlertController) { }
  searchBt()
  {
    return this.btSerial.list();
  }

  connectBT(address)
  {
    return this.btSerial.connect(address);

  }

  testPrint(address)
  {
    let printData = '^XA   ^MNM  ^PR6  ^JZY  ^FO20,100^AFN,18,18^FD Fec.Creacion:2021/05/26 15:52^FS  ^FO20,130^AFN,20,20^FD PROC.VALOR AGREGADO^FS  ^FO20,170^AFN,20,20^FD #REQ.: ^FS  ^FO190,170^AFN,20,20^FD 290110^FS  ^FO100,225^BY3^BCN,150,Y,Y,N^FD00678612067253604430^FS  ^FO20,400^AFN,20,20^FD LOTE: ^FS  ^FO120,400^AFN,60,60^FD 111570^FS  ^FO20,470^AFN,20,20^FD PROV: ^FS  ^FO180,470^AFN,18,18^FD NATURISA - INDUCAM (Farm ASC)^FS  ^FO20,510^AFN,30,30^FD PISCINA: ^FS  ^FO250,510^AFN,40,40^FD 16^FS  ^FO20,570^AFN,30,30^FD PESO: ^FS  ^FO180,570^AFN,60,60^FD 32^FS  ^FO550,570^AFN,15,15^FD  Cant:1-Tinas^FS  ^FO20,620^AFN,30,30^FD PROD: ^FS  ^FO180,620^AFN,28,28^FD 321 - SHELL-ON FRESCO B^FS  ^FO20,660^AFN,30,30^FD TALLA: ^FS  ^FO250,660^AFN,30,30^FD 26/30^FS  ^FO20,690^AFN,30,30^FD MQ: ^FS  ^FO160,690^AFN,18,18^FD MQ. 9^FS  ^FO20,730^AFN,30,30^FD PESADOR: ^FS  ^FO290,730^AFN,18,18^FD GORTEGA^FS  ^PQ2  ^XZ  ^PR6  ^XZ'

  console.log(printData);

    let loadings = this.alertCtrl.create({
      header: 'Printing Please wait...'
      }); 
    
    let xyz = this.connectBT(address).subscribe(async data => {
      alert('Connection Successful'); 
      (await loadings).dismiss();
      this.btSerial.write(printData).then( async dataz=>{
        let mno= await this.alertCtrl.create({
          header:"Print SUCCESS!",
          buttons:['Dismiss']
        });
        await mno.present();

        xyz.unsubscribe();
      },async errx=>{
        console.log("WRITE FAILED",errx);
        let mno= await this.alertCtrl.create({
          header:"ERROR "+errx,
          buttons:['Dismiss']
        });
        await mno.present();
      });
      },async err=>{
        console.log("CONNECTION ERROR",err);
        let mno= await this.alertCtrl.create({
          header:"ERROR "+err,
          buttons:['Dismiss']
        });
        await mno.present();
      });

  }

}

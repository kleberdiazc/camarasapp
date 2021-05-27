import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-consulta-sscc',
  templateUrl: './consulta-sscc.page.html',
  styleUrls: ['./consulta-sscc.page.scss'],
})
export class ConsultaSSCCPage implements OnInit {
  validationsForm: FormGroup;
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
  Devices;

  constructor(private _BluetoothSerial: BluetoothSerial
              ,private alertController:AlertController) {
    this.validationsForm = new FormGroup({
      'sscc': new FormControl('',Validators.compose([
        Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }
  ngOnInit() {
  
  }
  
  Buscar_Saldos() {
    
  }
  onSubmit(values) {
    console.log(this.validationsForm.get('sscc').value);
  }

  /*
   Bluethoot
  */
  
  ActivarBluetooth(){
    this._BluetoothSerial.isEnabled().then(response => {
      console.log("isEnabled");
      //this.isEnabled("ON");
      this.Listdevice();
    }, error => {
      console.log("isDisabled");
      this.isEnabled("Off");
    })
  }

  Listdevice() {
    this._BluetoothSerial.list().then(response => {
      this.Devices = response;
    }, error => {
      console.log("error");
    });
  }

  connect(address) {
    this._BluetoothSerial.connect(address).subscribe(suscribe => {
      this.deviceConnected();
    }, error => {
      console.log("error");
    })
  }

  deviceConnected() {
    this._BluetoothSerial.subscribe('/n').subscribe(success => {
      this.hundler(success)
    });
  }

  hundler(value) {
    console.log(value);
  }

  sebData() {
    this._BluetoothSerial.write("7").then(response => {
      console.log("oky")
    }, error => {
      console.log("problema")
    })
  }

  Disconnected() {
    this._BluetoothSerial.disconnect();
    console.log("dispositivo conectado");
  }
  async isEnabled(msg) {
    const alert =  await this.alertController.create({
      header: "Alerta",
      message: msg,
      buttons: [{
        text: 'Okay',
        handler:()=> {
          console.log("Okay")
        }
      }]
    })
  }

}

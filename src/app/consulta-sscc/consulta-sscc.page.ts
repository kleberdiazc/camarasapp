import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaSsccService } from './consulta-sscc.service';

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
  bluetoothList:any=[];
  selectedPrinter:any;

  constructor(private print:ConsultaSsccService
              ,private alertController:AlertController) {
    this.validationsForm = new FormGroup({
      'sscc': new FormControl('',Validators.compose([
        Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))

       //This will list all of your bluetooth devices
    });
    
    //this.listPrinter();

  }
  ngOnInit() {
  
  }
  
  Buscar_Saldos() {
    
  }
  onSubmit(values) {
    console.log(this.validationsForm.get('sscc').value);
  }

  selectPrinter(macAddress)
  {
    //Selected printer macAddress stored here
    this.selectedPrinter=macAddress;
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

  testConnectPrinter()
  {
    var id=this.selectedPrinter;
    if(id==null||id==""||id==undefined)
    {
      //nothing happens, you can put an alert here saying no printer selected
    }
    else
    {
      let foo=this.print.connectBT(id).subscribe(async data=>{
        console.log("CONNECT SUCCESSFUL",data);

        let mno= await this.alertController.create({
          header:"Connect successful",
          buttons:['Dismiss']
        });
        await mno.present();

      },async err=>{
        console.log("Not able to connect",err);
        let mno= await this.alertController.create({
          header:"ERROR "+err,
          buttons:['Dismiss']
        });
        await mno.present();
      });
    }

    

  }

  testPrinter()
  {
    var id=this.selectedPrinter;
    if(id==null||id==""||id==undefined)
    {
      //nothing happens, you can put an alert here saying no printer selected
    }
    else
    {
      let foo=this.print.testPrint(id);
    }
  }




}

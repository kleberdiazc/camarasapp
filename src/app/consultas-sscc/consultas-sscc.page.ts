import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-consultas-sscc',
  templateUrl: './consultas-sscc.page.html',
  styleUrls: ['./consultas-sscc.page.scss'],
})
export class ConsultasSsccPage implements OnInit {
  validationsForm: FormGroup;
  validations = {
    'sscc': [
      { type: 'required', message: 'sscc es requerido.' }
    ]
  };
  constructor(
    private alertController:AlertController) {
      this.validationsForm = new FormGroup({
      'sscc': new FormControl('',Validators.compose([
      Validators.required
      //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
      });


    }
  ngOnInit() {
  }

  onSubmit(values) {
    console.log(this.validationsForm.get('sscc').value);
  }

}

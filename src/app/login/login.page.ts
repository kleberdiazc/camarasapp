import { LoginservicesService } from './loginservices.service';
import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss'
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  Usuario: string;
  Password: string;

  validation_messages = {
    'Usuario': [
      { type: 'required', message: 'Usuario es requerido.' },
      { type: 'pattern', message: 'Ingrese un Usuario válido.' }
    ],
    'password': [
      { type: 'required', message: 'Contraseña es requerida.' }
    ]
  };



  constructor(
    public router: Router,
    public menu: MenuController,
    public _login: LoginservicesService,

    public alertController: AlertController) {
    this.loginForm = new FormGroup({
      'Usuario': new FormControl('', Validators.compose([
        Validators.required
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(2),
        Validators.required
      ]))
    });

    console.log("entra1");
  }

  ngOnInit() {
    console.log("entra4");
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.Usuario = "";
    this.Password = "";
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    console.log("entra3");
    this.menu.enable(true);
  }

  async doLogin() {
    /* this._login.ingresar(this.loginForm.get('Usuario').value, this.loginForm.get('password').value)
      .subscribe(() => {
        //this.loading.dismiss();
        if (this._login.activo()) {
          this.router.navigate(['app/categories']);
        }
      }); */


    this._login.getIngreso(this.loginForm.get('Usuario').value, this.loginForm.get('password').value)
      .subscribe(() => {
        //this.loading.dismiss();
        if (this._login.activo()) {
          this.router.navigate(['app/categories']);
        }
      });

    /* let user: string = "";
    let token: string = "";
    await this.showLoading("Cargando...");
    const valor = await new Promise(async (resolve) => {
      await this._login.getIngreso(this.loginForm.get('Usuario').value, this.loginForm.get('password').value).subscribe((resp) => {
        console.log(resp);
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            let dt: [][] = resp.Dt.Table;
            if (dt.length > 0) {
              if (dt[0]["error"].toString() === 'true') {
                this.presentAlert("Error", dt[0]["mensaje"].toString());
                return resolve(false);
              } else {
                user = dt[0]["usuario"].toString();
                token = dt[0]["token"].toString();
              }
              return resolve(true);
            }
          }
        } else {
          this.presentAlert("Error", resp.Description);

        }
        return resolve(false);

      });
    });

    if (valor) {
      const valorSt = await new Promise(async (resolve) => {
        await this._login.callStorage(user, token);
        return resolve(true)
      });
      this.hideLoading();
      if (this._login.activo()) {
        this.router.navigate(['app/categories']);
      }
    }
    this.hideLoading(); */
  }

}

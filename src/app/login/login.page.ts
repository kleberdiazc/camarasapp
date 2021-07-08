import { LoginservicesService } from './loginservices.service';
import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AppComponent } from './../app.component';
const { Storage } = Plugins;


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

  loading: any = null;
  async presentAlert(Header, Mensaje) {

    this.hideLoading();
    let css = (Header === "Error" ? "variant-alert-error" : Header === "Advertencia" ? "variant-alert-warning" : "variant-alert-success");
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: css,
        header: Header,
        message: Mensaje,
        buttons: [{
          text: 'OK',
          handler: () => {
            return resolve(true);
          },
        }]
      });

      await alert.present();
    });
  }

  async showLoading(mensaje) {

    return new Promise(async (resolve) => {
      this.loading = await this.loadingController.create({
        message: mensaje,
        translucent: true,
        cssClass: 'custom-class custom-loading',
      });
      await this.loading.present();
      return resolve(true);
    });
  }

  hideLoading() {

    if (this.loading !== null) {
      this.loadingController.dismiss();
      this.loading = null;
    }
  }

  constructor(
    public router: Router,
    public menu: MenuController,
    public _login: LoginservicesService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private _root: AppComponent) {
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


    /* this._login.getIngreso(this.loginForm.get('Usuario').value, this.loginForm.get('password').value)
      .subscribe(async () => {
        //this.loading.dismiss();
        if (await this._login.activo()) {
          this.router.navigate(['app/categories']);
        }
      }); */

    let user: string = "";
    let token: string = "";
    await this.showLoading("Cargando...");
    const valor = await new Promise(async (resolve) => {
      await this._login.getIngreso2(this.loginForm.get('Usuario').value, this.loginForm.get('password').value).subscribe(async (resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            let dt: [][] = resp.Dt.Table;
            if (dt.length > 0) {
              if (dt[0]["error"].toString() === 'true') {
                this.presentAlert("Error", dt[0]["mensaje"].toString());
                return resolve(false);
              } else {


                Storage.set({ key: "usuario", value: dt[0]["usuario"].toString() });
                Storage.set({ key: "token", value: dt[0]["token"].toString() });
                await this._root.onTitleChange(dt[0]["usuario"].toString());

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
      this.hideLoading();
      this.router.navigate(['app/categories']);
    }
    this.hideLoading();
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { TransaccionesService } from './transacciones.service';
import { AlertController, LoadingController, IonInput } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ResultWS, DataCombos, TablaCodigo, ClsProducto, tb_DataGrid } from './../interfaces/interfaces';
import { Dictionary } from './../Class/dictionary';
import { SelectionType } from '@swimlane/ngx-datatable';
import { LoginservicesService } from './../login/loginservices.service';
import { ParametrosService } from './../parametros/parametros.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.page.html',
  styleUrls: ['./transacciones.page.scss'],
})
export class TransaccionesPage implements OnInit {
  @ViewChild('inputSSCC', { static: false }) inputSSCC: IonInput;

  dataCombosTipo: DataCombos[] = [];
  dataCombosMotivo: DataCombos[] = [];
  dataCombosOrigen: DataCombos[] = [];
  dataCombosDestinoP: DataCombos[] = [];
  dataCombosDestino: DataCombos[] = [];
  dataCombosReci: DataCombos[] = [];
  dataCombosMQ: DataCombos[] = [];
  dataCombosTipoConv: DataCombos[] = [];
  dataCombosMovil: DataCombos[] = [];
  dataCombosChofer: DataCombos[] = [];
  dataComboUbicacion: DataCombos[] = [];
  respTable: TablaCodigo[] = [];
  TableResult: TablaCodigo[] = [];
  tb_detalle: tb_DataGrid[] = [];
  colSaldoProd: ClsProducto[] = [];
  DataGrid: tb_DataGrid[] = [];

  DetCajas = new Dictionary();
  DetLote = new Dictionary();

  cmbTipo: string = "";
  cmbMotivo: string = "";
  cmbOrigen: string = "";
  cmbDestino: string = "";
  cmbReci: string = "";
  cmbMQ: string = "";
  cmbTipoConv: string = "";
  cmbMovil: string = "";
  cmbChofer: string = "";
  cmbUbicacion: string = "";
  lbOrigen: boolean;
  lbDestino: boolean;
  EnabledCtrTab1: boolean;
  EnabledCmbConversion: boolean;
  chkConversion: string = "N";
  txtUltTran: string = "";
  txtSelloMovil: string = "";
  txtFactura: string = "";
  chkMatricial: boolean = false;
  txt_Copias: string = "";
  txtScannedValue: string = "";
  txtSSCC: string = "";
  lblTitSSCC: string = "";
  btn_DesEmpaque: string = "";
  ctrlTipoEmpaque: boolean;
  lbl_TipoEmpaque: string = "";
  ssccp: string = "";
  WorkingProd: string = "";
  WorkingTalla: string = "";
  num: number = 0;
  MaxCant: number = 0;
  txt_Cajas: string = "";
  descri: string = "";
  sscc: string = "";
  lote: string = "";
  detTalla: string = "";
  detLoteImp: string = "";
  num1: number = 0;
  DetTallaX: string = "";
  txt_pallets: string = "";
  txt_masters: string = "";
  txt_referencia: string = "";
  txt_Doc: string = "";
  chkCuarentena: boolean = false;
  chkInvent: boolean = false;
  chkSaldos: boolean = false;
  EnabledbtnReimprimir: boolean;

  Caduca: string = "";
  elaborado: string = "";
  taldescri: string = "";
  prod: string = "";
  control: boolean;
  tipoEtiqueta: string = "";
  totcajas: number = 0;
  codprod1: string = "";
  tallas1: string = "";
  codsscc1: string = "";
  secuen: number = 0;
  tallas: string = "";
  bodega: string = "";
  estado: string = "";
  SnInventariado: string = "";
  color: string = "";
  MIxcolor: string = "";
  GMixcolor: string = "";
  Gcolor: string = "";
  CantLote: number = 0;
  EnablechkCuarentena: boolean = false;

  DisabledControles: boolean = true;

  tab = 'Tab1';
  loading: any = null;
  isSelected: boolean = false;
  selected = [];
  SelectionType = SelectionType;

  keyword = "DESCRIPCION";


  /*MOVIL*/
  dataCombosMovilFilter: DataCombos[] = [];
  SelectMovil = { CODIGO: '', DESCRIPCION: '' };

  /*CHOFER*/
  dataCombosChoferFilter: DataCombos[] = [];
  SelectChofer = { CODIGO: '', DESCRIPCION: '' };


  /*EVENTOS MOVIL */
  async selectEventMovil(e) {
    this.SelectMovil = e;
    this.cmbMovil = this.SelectMovil.CODIGO;
    await this.showLoading("Cargando...");

    const valor = await new Promise(async (resolve) => {
      this._dataService.getDataChofer(e.CODIGO).subscribe((resp) => {
        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            if (resp.Dt.Table.length > 0) {
              this.respTable = resp.Dt.Table;
              this.SelectChofer = JSON.parse(JSON.stringify(this.respTable[0]));
              this.cmbChofer = this.SelectChofer.CODIGO;
            }
          }
        } else {
          this.presentAlert("Error", resp.Description);
        }
        return resolve(true);
      });
    });
    this.hideLoading();
  }

  onEventClearMovil(e) {
    this.SelectMovil = { CODIGO: '', DESCRIPCION: '' };
    this.cmbMovil = this.SelectMovil.CODIGO;
    this.dataCombosMovilFilter.length = 0;
  }

  onEventclosedMovil(e) {
    if (Object.values(this.SelectMovil).length !== 2) {
      this.SelectMovil = { CODIGO: '', DESCRIPCION: '' };
      this.cmbMovil = this.SelectMovil.CODIGO;
      this.dataCombosMovilFilter.length = 0;
    }
  }

  onChangeMovil(e) {
    if (e.length > 2) {
      this.dataCombosMovilFilter = JSON.parse(JSON.stringify(this.dataCombosMovil));
    } else {
      this.dataCombosMovilFilter.length = 0;
    }
  }

  /*EVENTOS CHOFER*/
  selectEventChofer(e) {
    this.SelectChofer = e;
    this.cmbChofer = this.SelectChofer.CODIGO;
  }

  onEventClearChofer(e) {
    this.SelectChofer = { CODIGO: '', DESCRIPCION: '' };
    this.cmbChofer = this.SelectChofer.CODIGO;
    this.dataCombosChoferFilter.length = 0;
  }

  onEventclosedChofer(e) {
    if (Object.values(this.SelectChofer).length !== 2) {
      this.SelectChofer = { CODIGO: '', DESCRIPCION: '' };
      this.cmbChofer = this.SelectChofer.CODIGO;
      this.dataCombosChoferFilter.length = 0;
    }
  }

  onChangeChofer(e) {
    if (e.length > 3) {
      this.dataCombosChoferFilter = JSON.parse(JSON.stringify(this.dataCombosChofer));
    } else {
      this.dataCombosChoferFilter.length = 0;
    }
  }



  async presentAlert(Header, Mensaje) {
    /* const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: Header,
      message: Mensaje,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss(); */
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


  async presentAlertConfirm(mensaje) {
    this.hideLoading();
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'Confirmar',
        message: mensaje,
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'SI',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }

  async showLoading(mensaje) {
    /* this.loading = this.loadingController.create({
      message: 'This Loader will Not AutoHide'
    }).then((res) => {
      res.present();
    }); */
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

  constructor(private router: Router, private _dataService: TransaccionesService, public alertController: AlertController,
    public loadingController: LoadingController, private _log: LoginservicesService
    , private _param: ParametrosService) {



  }
  async ngOnInit() {
    this.lbOrigen = true;
    this.lbDestino = true;
    this.EnabledCtrTab1 = false;
    this.EnabledCmbConversion = true;

    await this.showLoading("Cargando...");
    await this.loadData();
    this.OnClickNuevo("");
    this.hideLoading();
  }



  async loadData() {
    const valor = await new Promise(async (resolve) => {
      this._dataService.getDataInitial().subscribe((resp) => {

        if (resp.Codigo) {
          if (Object.keys(resp.Dt).length > 0) {
            this.dataCombosTipo = resp.Dt.Table;
          }
        } else {
          this.presentAlert("Error", resp.Description);

        }
        return resolve(true);
      });
    });
  }

  async loadDataMotivo(mov: string) {
    const valor = await new Promise(async (resolve) => {

      this._dataService.getDataMotivo(mov, await this._log.getuser()).subscribe((resp) => {
        if (resp.Codigo) {

          if (Object.keys(resp.Dt).length > 0) {

            this.dataCombosMotivo = resp.Dt.Table;
            this.dataCombosOrigen = resp.Dt.Table1;
            this.dataCombosDestinoP = resp.Dt.Table1;
            this.dataCombosReci = resp.Dt.Table2;
            this.dataCombosMQ = resp.Dt.Table3;
            this.dataCombosTipoConv = resp.Dt.Table4;
            this.dataCombosMovil = resp.Dt.Table5;
            this.dataCombosChofer = resp.Dt.Table6;
          } else {
            this.presentAlert("Error", resp.Description);
          }
        }
        return resolve(true);
      });
    });
  }

  async OnChangeTipo(e) {
    this.dataCombosMotivo = null;
    this.cmbMotivo = null;
    this.cmbOrigen = null;
    this.cmbDestino = null;
    if (e.detail.value === "T") {
      this.lbOrigen = false;
      this.lbDestino = false;
    } else {
      this.lbOrigen = false;
      this.lbDestino = true;
    }

    if (e.detail.value === "") {
      return;
    }
    await this.showLoading("Cargando...");
    await this.loadDataMotivo(e.detail.value);
    this.hideLoading();
  }

  /* OnChangeMovil(e) {
    this._dataService.getDataChofer(e.detail.value).subscribe((resp) => {
      if (resp.Codigo) {
        if (Object.keys(resp.Dt).length > 0) {
          if (resp.Dt.Table.length > 0) {
            this.respTable = resp.Dt.Table;
            this.cmbChofer = this.respTable[0].Codigo;
          }
        }
      } else {
        this.presentAlert("Error", resp.Description);
      }
    });

  } */

  async OnChangeBodOrigen(e) {
    if (e.detail.value === "") {
      return;
    }

    if (this.lbDestino === true) {
      await this.showLoading("Cargando...");
      await this.LlenarUbicacion(this.cmbOrigen.trim());
      this.hideLoading();
      this.EnabledCtrTab1 = true;
      this.tab = "Tab2";
    } else {
      this.dataCombosDestino = this.dataCombosDestinoP;
    }
  }

  async OnChangeBodDestino(e) {
    if (e.detail.value === "") {
      return;
    }

    await this.showLoading("Cargando...");
    await this.LlenarUbicacion(e.detail.value.toString().trim());
    this.hideLoading();
    if (e.detail.value.toString().trim().substring(0, 1) === "X" || e.detail.value.toString().trim() === "VA" ||
      e.detail.value.toString().trim() === "PL") {
      this.EnablechkCuarentena = true;
      this.chkCuarentena = true;
    } else {
      this.EnablechkCuarentena = false;
    }

    this.EnabledCtrTab1 = true;
    this.tab = "Tab2";


  }

  OnChangeConversion(e) {
    this.cmbTipoConv = null;
    this.chkConversion = e.detail.value;

    if (e.detail.value === "S") {

      this.EnabledCmbConversion = false;
    } else {

      this.EnabledCmbConversion = true;
      this.ctrlTipoEmpaque = true;
      this.lbl_TipoEmpaque = "";
      this.lblTitSSCC = "SSCC";
    }
  }

  OnChangeTipoConv(e) {
    if (e.detail.value === "") {
      return;
    }
    this.lblTitSSCC = "SSCC";
    this.EnabledbtnReimprimir = true;

    if (e.detail.value === "R") {
      if (this.cmbTipo === "T") {
        if (this.cmbOrigen.trim() !== this.cmbDestino.trim()) {
          this.presentAlert("Error", "El rearme solo se puede hacer dentro de la misma bodega origen y destino");
          this.cmbTipoConv = null;
          return;
        }
      }
      this.lblTitSSCC = "C.Pallet";
      this.EnabledbtnReimprimir = true;
    } else {
      this.EnabledbtnReimprimir = false;
    }

    if (e.detail.value === "UP") {
      if (this.cmbTipo === "T") {
        if (this.cmbOrigen.trim() !== this.cmbDestino.trim()) {
          this.presentAlert("Error", "Solo puede unificar pallets dentro de la misma bodega origen y destino");
          this.cmbTipoConv = null;
          return;
        }
      }
      this.lblTitSSCC = "SSCC";
      this.EnabledbtnReimprimir = true;
    } else {
      this.EnabledbtnReimprimir = false;
    }

    if (e.detail.value === "CM") {
      this.lblTitSSCC = "C.Master";
      this.EnabledbtnReimprimir = true;
    } else {
      this.EnabledbtnReimprimir = false;
      this.control = true;
    }

    this.ctrlTipoEmpaque = false;
    this.cmbTipoConv = e.detail.value;

    this.lbl_TipoEmpaque = this.dataCombosTipoConv.find(s => s.CODIGO === this.cmbTipoConv)["DESCRIPCION"].toString().trim();
  }

  show(tab) {
    this.tab = tab;
  }

  async OnClickNuevo(tipo) {
    this.tb_detalle.length = 0;
    this.DataGrid.length = 0;
    this.colSaldoProd.length = 0;

    this.dataCombosMotivo = null;
    this.dataCombosOrigen = null;
    this.dataCombosDestino = null;
    this.dataCombosReci = null;
    this.dataCombosMQ = null;
    this.dataCombosTipoConv = null;
    this.dataCombosMovil = null;
    this.dataCombosChofer = null;
    this.dataComboUbicacion = null;


    /*  this.cmbTipo = "";
     this.cmbOrigen = "";
     this.cmbDestino = "";
     this.cmbMQ = "";
     this.cmbTipoConv = "";
     this.cmbChofer = "";
     this.cmbMovil = "";
     this.cmbReci = "";
     this.txtUltTran = "";
     this.txt_referencia = "";
     this.txt_pallets = "";
     this.txt_masters = "";
     this.txt_Cajas = "";
 
     this.EnabledCtrTab1 = false;
     this.lbOrigen = false;
     this.lbDestino = true;
 
     this.chkConversion = "N";
     this.EnabledCmbConversion = true;
     this.ctrlTipoEmpaque = true;
     this.lbl_TipoEmpaque = "";
     this.lblTitSSCC = "SSCC";
 
 
     this.tab = "Tab1";
 
     this.txt_Copias = "1";
  */


    //LOAD
    this.DetCajas.clear();
    this.DetLote.clear();

    this.cmbTipo = "";
    this.cmbMotivo = "";
    this.cmbOrigen = "";
    this.cmbDestino = "";
    this.cmbReci = "";
    this.cmbMQ = "";
    this.cmbTipoConv = "";
    this.cmbMovil = "";
    this.cmbChofer = "";

    this.SelectMovil = { CODIGO: '', DESCRIPCION: '' };
    this.dataCombosMovilFilter.length = 0;
    this.SelectChofer = { CODIGO: '', DESCRIPCION: '' };
    this.dataCombosChoferFilter.length = 0;

    this.cmbUbicacion = "";
    this.lbOrigen = false;
    this.lbDestino = true;
    this.EnabledCtrTab1 = false;
    this.chkConversion = "N";

    this.txtSelloMovil = "";
    this.txtFactura = "";
    this.chkMatricial = false;
    this.txt_Copias = "1";
    this.txtScannedValue = "";
    this.txtSSCC = "";
    this.lblTitSSCC = "SSCC";
    this.btn_DesEmpaque = "";
    this.ctrlTipoEmpaque = true;
    this.lbl_TipoEmpaque = "";
    this.ssccp = "";
    this.WorkingProd = "";
    this.WorkingTalla = "";
    this.num = 0;
    this.MaxCant = 0;
    this.txt_Cajas = "";
    this.descri = "";
    this.sscc = "";
    this.lote = "";
    this.detTalla = "";
    this.detLoteImp = "";
    this.num1 = 0;
    this.DetTallaX = "";
    this.txt_pallets = "";
    this.txt_masters = "";
    this.txt_referencia = "";
    this.txt_Doc = "";
    this.chkCuarentena = true;
    this.EnablechkCuarentena = false;
    this.chkInvent = false;
    this.chkSaldos = true;
    this.EnabledbtnReimprimir = false;

    this.Caduca = "";
    this.elaborado = "";
    this.taldescri = "";
    this.prod = "";
    this.control = false;
    this.tipoEtiqueta = "";
    this.totcajas = 0;
    this.codprod1 = "";
    this.tallas1 = "";
    this.codsscc1 = "";
    this.secuen = 0;
    this.tallas = "";
    this.bodega = "";
    this.estado = "";
    this.SnInventariado = "";
    this.color = "";
    this.MIxcolor = "";
    this.GMixcolor = "";
    this.Gcolor = "";
    this.CantLote = 0;

    this.tab = "Tab1";

    this.DisabledControles = false;

    if (tipo !== "SAVE") {
      this.EnabledCmbConversion = true;
      this.txtUltTran = "";
    }
  }

  onSelect(e) { console.log("select"); console.log(this.selected); console.log(this.selected[0].sscc.toString()); }

  async OnClickReimprimir() {
    try {
      let pallet: string = "";
      if (this.txt_Copias.trim() === "") {
        this.txt_Copias = "1";
      }
      if (this.txtUltTran.toString().trim() !== "") {
        await this.ImprimirMultipaginas(this.txtUltTran.toString().trim(), "");
      } else {
        if (this.selected.length > 0) {
          pallet = this.selected[0].sscc.toString(); /* CType(Me.DataGrid1.DataSource, DataTable).Rows(Me.DataGrid1.CurrentCell.RowNumber()).Item(0) */
          for (let index = 0; index < Number(this.txt_Copias); index++) {
            await this.imprimirpall(pallet);

          }
        }
      }
    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }

  async OnClickGrabar() {
    await this.showLoading("Grabando...");
    try {

      /* if (!this.ValidarCampos()) {
        this.hideLoading();
        return;
      } */
      if (this.cmbTipo === null || this.cmbTipo === "") {
        this.presentAlert("Advertencia", "Debe escoger un Tipo");
        return;
      }

      if (this.cmbMotivo === null || this.cmbMotivo === "") {
        this.presentAlert("Advertencia", "Debe escoger un Motivo");
        return;
      }

      if (this.cmbOrigen === null || this.cmbOrigen === "") {
        this.presentAlert("Advertencia", "Debe escoger una Bodega Origen");
        return;
      }

      if (this.lbDestino === false) {
        if (this.cmbDestino === null || this.cmbDestino === "" || this.cmbDestino === "-1") {
          this.presentAlert("Advertencia", "Debe escoger una Bodega Destino");
          return;
        }
      }

      if (this.cmbTipo === "I" && this.cmbOrigen === "IQ") {
        this.presentAlert("Advertencia", "Debe ingresar el Lote");
        return;
      }

      if (this.chkConversion === null || this.chkConversion === "") {
        this.presentAlert("Advertencia", "Debe escoger conversión SI/NO");
        return;
      }

      if (this.chkConversion === "S") {
        if (this.cmbTipoConv === null || this.cmbTipoConv === "") {
          this.presentAlert("Advertencia", "Debe escoger el tipo de conversión primero");
          return;
        }
      }

      if (this.cmbTipo.trim() === "T") {
        if (this.cmbReci === null || this.cmbReci.trim() === "") {
          this.presentAlert("Advertencia", "Debe ingresar responsable");
          return;
        }
      }

      if (this.cmbTipo.trim() === "I") {
        if (this.txt_referencia.trim() === "") {
          this.presentAlert("Advertencia", "Debe de ingresar Número de referencia");
          return;
        }
      }

      if (this.chkConversion === "N") {
        if (this.cmbTipoConv !== "CM" && this.cmbTipoConv !== "D") {

        }
      }
      if (this.txtFactura === "") { this.txtFactura = "0"; }



      if (this.DataGrid.length <= 0) {
        this.presentAlert("Advertencia", "No hay detalle para grabar");
        return;
      }

      const valor = await new Promise(async (resolve) => {
        if (!await this.guardarmov()) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      });

      if (!valor) {
        this.hideLoading();
        //await this.presentAlert("Error", "Error en actualizacion");
        return;
      }

      this.OnClickNuevo("SAVE");
      this.hideLoading();

    } catch (error) {
      this.hideLoading();
      await this.presentAlert("Error", error);

    }
  }

  onChangeSSCC(e) {
    //console.log(e);
    this.onEnterSSCC(e);
  }

  async onEnterSSCC(txt) {
    try {

      let Prodx: string;
      let Lotex: string;
      let Talla: string;
      let Tallavta: string;
      let DescTallavta: string;
      let Cant: number;
      let DetTallaX: string;

      if (this.cmbTipo === null || this.cmbTipo === "") {
        this.presentAlert("Advertencia", "Debe escoger un Tipo");
        return;
      }

      if (this.cmbMotivo === null || this.cmbMotivo === "") {
        this.presentAlert("Advertencia", "Debe escoger un Motivo");
        return;
      }

      if (this.cmbOrigen === null || this.cmbOrigen === "") {
        this.presentAlert("Advertencia", "Debe escoger una Bodega Origen");
        return;
      }

      if (this.lbDestino === false) {
        if (this.cmbDestino === null || this.cmbDestino === "" || this.cmbDestino === "-1") {
          this.presentAlert("Advertencia", "Debe escoger una Bodega Destino");
          return;
        }
      }

      if (this.cmbTipo === "I" && this.cmbOrigen === "IQ") {
        this.presentAlert("Advertencia", "Debe ingresar el Lote");
        return;
      }

      if (this.chkConversion === null || this.chkConversion === "") {
        this.presentAlert("Advertencia", "Debe escoger conversión SI/NO");
        return;
      }

      if (this.chkConversion === "S") {
        if (this.cmbTipoConv === null || this.cmbTipoConv === "") {
          this.presentAlert("Advertencia", "Debe escoger el tipo de conversión primero");
          return;
        }
      }

      if (this.cmbTipo.trim() === "T") {
        if (this.cmbReci === null || this.cmbReci.trim() === "") {
          this.presentAlert("Advertencia", "Debe ingresar responsable");
          return;
        }
      }

      if (this.cmbTipo.trim() === "I") {
        if (this.txt_referencia.trim() === "") {
          this.presentAlert("Advertencia", "Debe de ingresar Número de referencia");
          return;
        }
      }

      if ((txt.length === 20 && txt.substring(0, 1) !== "]") ||
        (txt.length === 23 && txt.substring(0, 1) === "]")) {
        if (txt.length === 23) {
          this.txtSSCC = txt.substring(5, txt.length);
        } else {
          this.txtSSCC = txt.substring(2, txt.length);
        }
      } else {
        return;
      }

      /* if ((this.txtScannedValue.length === 20 && this.txtScannedValue.substring(0, 1) !== "]") ||
        (this.txtScannedValue.length === 23 && this.txtScannedValue.substring(0, 1) === "]")) {
        if (this.txtScannedValue.length === 23) {
          this.txtSSCC = this.txtScannedValue.substring(5, this.txtScannedValue.length);
        } else {
          this.txtSSCC = this.txtScannedValue.substring(2, this.txtScannedValue.length);
        }
      } else {
        return;
      } */

      await this.showLoading("Cargando...");

      //obtengo el tipo de etiqueta para ya no validar por barras
      const v1 = await new Promise(async (resolve) => {
        this._dataService.getTipoSSCC(this.txtSSCC).subscribe((resp) => {

          if (!resp.Codigo) {
            this.presentAlert("Error", resp.Description);
            return resolve(false);
          }
          if (Object.keys(resp.Dt).length > 0) {
            if (resp.Dt.Table.length > 0) {
              this.TableResult = resp.Dt.Table;
              if (this.TableResult.length > 0) {
                this.tipoEtiqueta = this.TableResult[0]["Clase"];
              }
            }
          }
          return resolve(true);
        });
      });

      if (!v1) {
        return;
      }

      if (!this.ValidarCodigosSSCCxOpcion()) {
        this.txtScannedValue = "";
        setTimeout(() => this.inputSSCC.setFocus(), 300);
        this.hideLoading();
        return;
      }
      if (this.lblTitSSCC === "C.Pallet" || this.lblTitSSCC === "C.Master") {
        if (this.cmbTipoConv === "R" || this.cmbTipoConv === "CM" || this.cmbTipoConv === "P") {
          if (!await this.cargar()) {
            this.hideLoading();
            return;
          }
        }

        this.lblTitSSCC = "SSCC";
        this.txtScannedValue = "";
        setTimeout(() => this.inputSSCC.setFocus(), 300);
        this.control = false;
        this.hideLoading();
        return;
      }

      if (this.chkConversion === "S" && this.cmbTipoConv === "M") {
        try {

          const v2 = await new Promise(async (resolve) => {
            this._dataService.getDataValidaCaja(this.txtSSCC).subscribe(async (resp) => {
              if (!resp.Codigo) {
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                await this.presentAlert("Error", resp.Description);

                return resolve(false);
              }
              if (Object.keys(resp.Dt).length > 0) {
                if (resp.Dt.Table.length > 0) {
                  this.TableResult = resp.Dt.Table;
                  if (this.TableResult.length <= 0) {
                    this.txtScannedValue = "";
                    setTimeout(() => this.inputSSCC.setFocus(), 300);
                    return resolve(false);
                  }
                  else {
                    Prodx = this.TableResult[0]["SSCC_CodProd"].ToString();
                    Lotex = this.TableResult[0]["dsscc_lote"].ToString();
                    Talla = this.TableResult[0]["SSCC_Talla"].ToString();
                    Tallavta = this.TableResult[0]["SSCC_Tallavta"].ToString();
                    DescTallavta = this.TableResult[0]["SSCC_TalDescriVta"].ToString();
                    Cant = Number(this.TableResult[0]["emb_cantid"]);
                    this.Caduca = this.TableResult[0]["sscc_feccadu"].ToString();
                    this.elaborado = this.TableResult[0]["sscc_fecelab"].ToString();
                    this.taldescri = this.TableResult[0]["sscc_taldescri"].ToString();
                    this.prod = this.TableResult[0]["codbarean14m"].ToString();

                    //aqui debo cambiar la condicion de que si la tabla del grid esta en 0
                    if (this.tb_detalle.length === 0) {
                      const v2_1 = await new Promise(async (resolve) => {
                        this._dataService.getGenerarm(Prodx, Talla, Tallavta, await this._log.getuser()).subscribe(async (resp) => {
                          if (resp.Codigo) {
                            if (resp.Dt !== undefined) {
                              if (resp.Dt.Table.length > 0) {
                                this.TableResult = resp.Dt.Table;
                                this.ssccp = this.TableResult[0]["SSCC"].ToString();
                                if (this.ssccp.length === 18) {
                                  this.btn_DesEmpaque = this.TableResult[0]["SSCC"].ToString();
                                }
                              }
                            }
                            return resolve(true);
                          } else {
                            this.presentAlert("Error", resp.Description);
                            return resolve(false);
                          }
                        });
                      });

                      if (!v2_1) {
                        return;
                      }

                      this.InicializaGrid();
                      this.num = 0;
                      this.WorkingProd = Prodx;
                      this.WorkingTalla = Talla;

                      if (Object.keys(this.DetLote.items).length > 0) {
                        this.DetLote.clear();
                      }
                      if (Object.keys(this.DetCajas.items).length > 0) {
                        this.DetCajas.clear();
                      }

                      this.DetLote.set(Lotex, 1);
                      this.DetCajas.set(this.txtSSCC, this.txtSSCC);

                      this.MaxCant = Cant;

                    } else {
                      if (this.WorkingProd !== Prodx || this.WorkingTalla !== Talla) {
                        await this.presentAlert("Error", "Solo se pueden armar masters con codigos de productos y tallas iguales");
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      }
                      //aqui debo cambiar la condicion de que no pistolee la misma barra

                      if (this.DetCajas.has(this.txtSSCC)) {
                        await this.presentAlert("Error", "El código SSCC de caja ya ha sido leido");
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      } else {
                        //agrego elsscc al arreeglo
                        this.DetCajas.set(this.txtSSCC, this.txtSSCC);
                      }
                      //revisar
                      if (this.DetLote.has(Lotex)) {
                        this.DetLote.set(Lotex, this.DetLote.get(Lotex) + 1);
                      } else {
                        this.DetLote.set(Lotex, 1);
                      }
                    }

                    this.num += 1;
                    this.txt_Cajas = this.num.toString();

                    //agrego detalle al grid
                    let r_dt: tb_DataGrid = { "sscc": "", "num": 0, "ssccp": "", "ubic": "" };
                    r_dt.sscc = this.txtSSCC;
                    r_dt.num = this.num;
                    r_dt.ssccp = this.ssccp;
                    r_dt.ubic = this.cmbUbicacion;

                    this.tb_detalle.push(r_dt);
                    this.DisabledControles = true;

                    if (this.num === this.MaxCant) {
                      Object.keys(this.DetLote.items).forEach(async element => {
                        await new Promise(async (resolve) => {
                          this._dataService.SSCC_GuardaDetMaster(this.ssccp, element, this.DetLote.items[element].toString().trim()).subscribe((resp) => {
                            if (resp.Codigo) {
                            }
                            return resolve(true);
                          });
                        });
                        DetTallaX = DetTallaX + element + "(" + this.DetLote.items[element] + ")" + ", ";
                      });

                      DetTallaX = DetTallaX.substring(0, DetTallaX.length - 2);
                      if (Object.keys(this.DetLote.items).length === 1) {
                        DetTallaX = DetTallaX.substring(0, DetTallaX.indexOf("(") - 1);
                      }
                      this.CantLote = Object.keys(this.DetLote.items).length;

                      this.descri = Prodx;
                      this.sscc = this.ssccp;
                      this.lote = Lotex;
                      this.detTalla = this.taldescri;
                      this.detTalla = DescTallavta;
                      this.detLoteImp = this.DetTallaX;
                      this.num1 = this.MaxCant;

                      await this.guardarmov();

                      await this.imprimirMaster();
                      await this.imprimirLote();


                      this.tb_detalle.length = 0;

                      this.tab = "Tab1";
                      this.cmbTipo = "";
                      this.dataCombosMotivo = null;
                      this.cmbMotivo = "";
                      this.dataCombosOrigen = null;
                      this.cmbOrigen = "";
                      this.dataCombosDestino = null;
                      this.dataCombosDestinoP = null;
                      this.cmbDestino = "";

                      this.chkConversion = "N";
                      this.dataCombosTipoConv = null;
                      this.cmbTipoConv = "";

                      this.txt_pallets = "";
                      this.txt_masters = "";
                      this.txt_Cajas = "";

                      this.txt_referencia = "";
                      this.txtScannedValue = ""
                      setTimeout(() => this.inputSSCC.setFocus(), 300);

                      this.txt_Doc = "";

                      this.num = 0;
                      this.num1 = 0;
                      this.lblTitSSCC = "SSCC";

                      this.tb_detalle.length = 0;
                      this.DataGrid.length = 0;

                      this.btn_DesEmpaque = "";

                    }

                  }

                  this.txtScannedValue = "";
                  setTimeout(() => this.inputSSCC.setFocus(), 300);
                  return resolve(true);
                }
              }
            });
          });

          /* if (!v2) {
            return;
          }  */
          this.hideLoading();
          return;

        } catch (error) {
          this.txtScannedValue = "";
          setTimeout(() => this.inputSSCC.setFocus(), 300);
          this.presentAlert("Error", error);
        }
      }

      try {
        if (!await this.LecturaCodigoBase()) {
          this.hideLoading();
          return;
        }
        if (this.control) {
          //PALLET
          if (this.cmbTipoConv === "P") {
            if (!await this.generar()) {
              this.hideLoading();
              return;
            }
          }
          if (!this.control) {
            this.hideLoading();
            return;
          }
          //aqui
          this.InicializaGrid();
          this.AñadirFilaalGrid("Nuevo");

          if (!await this.AniadirMasteraPallet(this.ssccp, this.lote, this.txtSSCC)) {
            await this.presentAlert("Error", "Error al añadir al pallet");
            return;
          }

          let r_dt: tb_DataGrid = { "sscc": "", "num": 0, "ssccp": "", "ubic": "" };
          r_dt.sscc = this.txtSSCC;
          r_dt.num = this.num;
          r_dt.ssccp = this.ssccp;
          r_dt.ubic = this.cmbUbicacion;

          this.tb_detalle.push(r_dt);
          this.DisabledControles = true;
          //Desarme
          if (this.chkConversion === "S" && this.cmbTipoConv === "D") {
            this.DataGrid = this.tb_detalle;
            this.DataGrid = JSON.parse(JSON.stringify(this.DataGrid));
          }
          this.txt_masters = this.num.toString();
          this.control = false;
        }
        else {
          if (this.num > 0) {
            if (this.tb_detalle.length > 0) {
              for (let index = 0; index < this.tb_detalle.length; index++) {
                if (this.txtSSCC === this.tb_detalle[index].sscc) {
                  await this.presentAlert("Error", "codigo repetido");
                  this.txtScannedValue = "";
                  setTimeout(() => this.inputSSCC.setFocus(), 300);
                  return;
                }

              }
            }
          }

          if (!await this.AniadirMasteraPallet(this.ssccp, this.lote, this.txtSSCC)) {
            await this.presentAlert("Error", "Error al añadir al pallet");
            return;
          }
          this.InicializaGrid();
          this.num = this.num + 1;
          let r_dt: tb_DataGrid = { "sscc": "", "num": 0, "ssccp": "", "ubic": "" };
          r_dt.sscc = this.txtSSCC;
          r_dt.num = this.num;
          r_dt.ssccp = this.ssccp;
          r_dt.ubic = this.cmbUbicacion;


          this.tb_detalle.push(r_dt);
          this.DisabledControles = true;

          if (this.txt_pallets === "") {
            this.txt_pallets = "0";
          }
          if (this.txt_masters === "") {
            this.txt_masters = "0";
          }
          if (this.txt_Cajas === "") {
            this.txt_Cajas = "0";
          }

          if (this.tipoEtiqueta === "P") {
            this.txt_pallets = (Number(this.txt_pallets) + 1).toString();
          } else {
            if (this.tipoEtiqueta === "M") {
              this.txt_masters = (Number(this.txt_masters) + 1).toString();
            } else {
              this.txt_Cajas = (Number(this.txt_Cajas) + 1).toString();
            }
          }

          if (this.chkConversion === "N") {
            this.DataGrid = this.tb_detalle;
            this.DataGrid = JSON.parse(JSON.stringify(this.DataGrid));
          }
          if (this.chkConversion === "S") {
            if (this.cmbTipoConv !== "P" && this.cmbTipoConv !== "R") {
              this.DataGrid = this.tb_detalle;
              this.DataGrid = JSON.parse(JSON.stringify(this.DataGrid));
            }
          }

        }
        this.txtScannedValue = "";
        setTimeout(() => this.inputSSCC.setFocus(), 300);
        this.hideLoading();
      } catch (error) {
        await this.presentAlert("Error", error);
      }

      /* }); */

    } catch (error) {
      this.txtScannedValue = "";
      setTimeout(() => this.inputSSCC.setFocus(), 300);
      await this.presentAlert("Error", error);
    }

    this.hideLoading();
  }

  InicializaGrid() {
    if (this.tb_detalle.length === 0) {
      this.totcajas = 0;
    }

    if (this.cmbTipoConv === "N") {
      return;
    }
    if (this.cmbTipoConv.trim() === "R" && this.num === 0) {
      this.num1 = this.num1 + 1;

      let r_dt: tb_DataGrid = { "sscc": "", "num": 0, "ssccp": "", "ubic": "" };

      r_dt.sscc = this.ssccp;
      r_dt.num = this.num1;
      r_dt.ssccp = "";
      r_dt.ubic = this.cmbUbicacion;
      this.DataGrid.push(r_dt);
      this.DataGrid = JSON.parse(JSON.stringify(this.DataGrid));
    }
  }

  async ValidarCodigosSSCCxOpcion() {

    let rs = false;
    if (this.chkConversion === "S") {
      if (this.cmbTipoConv === "R" || this.cmbTipoConv === "P") {
        if (this.lblTitSSCC === "C.Pallet") {
          if (this.tipoEtiqueta === "M") {
            await this.presentAlert("Advertencia", "El SSCC es de Master");
            return rs;
          } else {
            if (this.tipoEtiqueta === "C") {
              await this.presentAlert("Advertencia", "El SSCC es de caja");
              return rs;
            }
          }
        } else {
          if (this.tipoEtiqueta !== "M") {
            await this.presentAlert("Advertencia", "Solo debe leer Masters");
            return rs;
          }
        }
      }
      //PALLET
      if (this.cmbTipoConv === "UP") {
        if (this.tipoEtiqueta !== "P") {
          await this.presentAlert("Advertencia", "El SSCC no es de Pallets");
          return rs;
        }
      }
      //MASTER
      if (this.cmbTipoConv === "M") {
        if (this.tipoEtiqueta === "M") {
          await this.presentAlert("Advertencia", "El SSCC es de Master");
          return rs;
        }
        if (this.tipoEtiqueta === "P") {
          await this.presentAlert("Advertencia", "El SSCC es de Pallet");
          return rs;
        }
      }
      //CAJAS DE MASTER
      if (this.cmbTipoConv === "CM") {
        if (this.lblTitSSCC === "C.Master") {
          if (this.tipoEtiqueta !== "M") {
            await this.presentAlert("Advertencia", "Solo debe leer Master");
            return rs;
          }
        } else {
          if (this.tipoEtiqueta !== "C") {
            await this.presentAlert("Advertencia", "Solo debe leer Cajas");
            return rs;
          }
        }
      }

      //DESARME COMPLETO
      if (this.cmbTipoConv === "DC") {
        if (this.tipoEtiqueta === "C") {
          await this.presentAlert("Advertencia", "El SSCC es de Caja");
          return rs;
        }
      }

      //DESARME
      if (this.cmbTipoConv === "D") {
        if (this.tipoEtiqueta === "P") {
          await this.presentAlert("Advertencia", "El SSCC es de Pallet");
          return rs;
        }
      }

    }
    rs = true;
    return rs;
  }

  //ojo falta
  /* ValidarCampos() {
    let rs: boolean = true;
    try {

    } catch (error) {
      this.presentAlert("Error", error);
    }
    return rs;
  } */

  async cargar() {
    let result = false;
    try {
      if (!await this.ValidarCodigosSSCCxOpcion()) {
        return result;
      }

      let j: boolean = false;

      if (this.cmbTipoConv === "R" || this.cmbTipoConv === "CM" || this.cmbTipoConv === "UP") {
        if (!await this.LecturaCodigoBase()) {
          return result;
        }
        this.ssccp = this.txtSSCC;

        this.InicializaGrid();

        if (this.cmbTipoConv === "CM") {
          this.btn_DesEmpaque === this.ssccp;
          result = true;
          return result;
        }

      }
      else {
        for (let index = 0; index < this.tb_detalle.length; index++) {
          if (this.tb_detalle[index].sscc === this.txtSSCC) {
            j = true;
            break;
          }
        }
        if (!j) {
          if (!await this.LecturaCodigoBase()) {
            await this.presentAlert("Error", "No existe el codigo SSCC");
            return result;
          } else {
            await this.AñadirFilaalGrid("Existe");
          }
        }
      }

      const v1 = await new Promise(async (resolve) => {
        await this._dataService.getDetallePallet(this.txtSSCC).subscribe((resp) => {

          if (!resp.Codigo) {
            this.presentAlert("Error", resp.Description);
            this.txtScannedValue = "";
            setTimeout(() => this.inputSSCC.setFocus(), 300);
            return resolve(false);
          }
          if (Object.keys(resp.Dt).length > 0) {
            if (resp.Dt.Table.length > 0) {
              let ds: [][] = resp.Dt.Table;

              if (ds.length <= 0) {
                this.presentAlert("Error", "No existe el codigo SSCC");
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(false);
              }
              else {
                this.ssccp = ds[0]["dsscc_sscc"];
                this.btn_DesEmpaque = this.ssccp;
                this.tb_detalle.length = 0;
                this.num = 0;

                if (this.cmbTipoConv === "UP") {
                  this.InicializaGrid();
                  this.totcajas = 0;
                  this.txtScannedValue = "";
                  setTimeout(() => this.inputSSCC.setFocus(), 300);
                  return resolve(true);
                }

                for (let ii = 0; ii < ds.length; ii++) {
                  if (this.cmbTipoConv !== "R") {
                    this.InicializaGrid();
                    this.totcajas = 0;
                  }
                  this.txt_pallets = this.num1.toString();
                  this.num = this.num + 1;
                  this.ssccp = ds[0]["dsscc_sscc"];
                  this.lote = ds[0]["dscc_cantidad"];
                  this.sscc = ds[0]["dsscc_numero"];
                  this.codprod1 = ds[0]["sscc_codprod"];
                  this.tallas1 = ds[0]["sscc_talla"];
                  this.codsscc1 = ds[0]["dsscc_numero"];

                  let r_dt: tb_DataGrid = { "sscc": "", "num": 0, "ssccp": "", "ubic": "" };
                  r_dt.sscc = this.sscc;
                  r_dt.num = Number(this.lote);
                  r_dt.ssccp = this.ssccp;
                  r_dt.ubic = "";


                  this.tb_detalle.push(r_dt);
                  this.DisabledControles = true;


                }
                this.txt_masters = ds.length.toString();
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(true);
              }
            }
          }
        });
      });

      return v1;

    } catch (error) {
      this.txtScannedValue = "";
      setTimeout(() => this.inputSSCC.setFocus(), 300);
      await this.presentAlert("Error", error);
    }
    return result;
  }

  async guardarmov() {
    return await new Promise(async (resolve) => {
      try {

        if (this.secuen === 0) {

          const r1 = await new Promise(async (resolveo) => {
            await this._dataService.getSecuencial(this.cmbMotivo).subscribe((resp) => {
              if (!resp.Codigo) {

                this.presentAlert("Error", resp.Description);
                return resolveo(false);
              }
              if (Object.keys(resp.Dt).length > 0) {
                if (resp.Dt.Table.length > 0) {
                  let ds: [][] = resp.Dt.Table;
                  this.secuen = Number(ds[0]["secuencial"]) + 1;
                  return resolveo(true);
                }
              }
            });
          });
          if (!r1) {
            return resolve(false);
          }
        } else {
          const r2 = await new Promise(async (resolveo) => {
            await this._dataService.getExistenciaTra(this.secuen).subscribe(async (resp) => {
              if (!resp.Codigo) {
                this.presentAlert("Error", resp.Description);
                return resolveo(true);
                /* return rs; */
              }
              if (Object.keys(resp.Dt).length > 0) {
                if (resp.Dt.Table.length > 0) {
                  let ds: [][] = resp.Dt.Table;
                  if (Number(ds[0]["cont"]) === 1) {
                    /* rs = true; */

                    this.presentAlert("Información", "Grabado con Exito, TRansaccion #" + this.secuen.toString());
                    this.txtUltTran = this.secuen.toString();
                    if (await !this.presentAlertConfirm("Desea Imprimir Resumen?")) {
                      this.ImprimirMultipaginas(this.secuen, "");
                    }
                    return resolveo(true);
                    /* return rs; */
                  }
                }
              }
              return resolveo(true);
            });

          });
          if (r2) {
            return resolve(r2);
          }
        }

        let Cadena2: string = "";
        let XML: string = "";
        XML = "<?xml version=\"1.0\" standalone=\"yes\" ?> ";
        XML = XML + "<Tabla>";

        //si son cajas tengo que primero grabar el codigo del master el cual voy a egresar
        if (this.cmbTipoConv == "CM" || this.cmbTipoConv == "M") {
          XML = XML + "<detalle>";
          Cadena2 = Cadena2 + "<tcd_sscc>" + this.btn_DesEmpaque + "</tcd_sscc>";
          Cadena2 = Cadena2 + "<tcd_lote>0</tcd_lote>";
          Cadena2 = Cadena2 + "<tcd_produc></tcd_produc>";
          Cadena2 = Cadena2 + "<tcd_codtal>0</tcd_codtal>";
          Cadena2 = Cadena2 + "<tcd_cantid>1</tcd_cantid>";
          Cadena2 = Cadena2 + "<tcd_ubicbarorig></tcd_ubicbarorig>";

          XML = XML + Cadena2;
          XML = XML + "</detalle>";
        }
        for (let j = 0; j < this.DataGrid.length; j++) {
          Cadena2 = "";
          XML = XML + "<detalle>";
          Cadena2 = Cadena2 + "<tcd_sscc>" + this.tb_detalle[j]["sscc"].toString().trim() + "</tcd_sscc>";
          Cadena2 = Cadena2 + "<tcd_lote>0</tcd_lote>";
          Cadena2 = Cadena2 + "<tcd_produc>pallets</tcd_produc>";
          Cadena2 = Cadena2 + "<tcd_codtal>0</tcd_codtal>";
          Cadena2 = Cadena2 + "<tcd_cantid>1</tcd_cantid>";
          Cadena2 = Cadena2 + "<tcd_ubicbarorig>" + (this.tb_detalle[j]["ubic"] === null ? "" : this.tb_detalle[j]["ubic"].toString().trim()) + "</tcd_ubicbarorig>";

          XML = XML + Cadena2;
          XML = XML + "</detalle>";

        }

        XML = XML + "</Tabla>";


        const r3 = await new Promise(async (resolveo) => {
          await this._dataService.GrabaMovimiento(this.secuen.toString(), this.cmbMotivo.trim(), this.cmbTipo, "1", this.cmbOrigen,
            (this.cmbDestino === null ? "" : this.cmbDestino.toString().trim()),
            (this.txt_referencia === "" ? "0" : this.txt_referencia),
            this.txt_Doc, this.chkConversion,
            (this.cmbTipoConv === null || this.cmbTipoConv === "" ? "" : this.dataCombosTipoConv.find(s => s.CODIGO === this.cmbTipoConv)["DESCRIPCION"].toString().trim()),
            await this._log.getuser(),
            (this.cmbReci === null || this.cmbReci === "" ? await this._log.getuser() : this.cmbReci.toString().trim()),
            (this.cmbMovil === null ? "" : this.cmbMovil.toString().trim()), this.txtSelloMovil,
            (this.cmbChofer === null ? "" : this.cmbChofer.toString().trim()),
            this.txtFactura, (this.cmbMQ === null ? "" : this.cmbMQ.toString().trim()), XML).subscribe(async (resp) => {

              if (resp.Codigo) {
                await this.presentAlert("Información", "Grabado con Éxito, TRansaccion #" + this.secuen.toString());
                this.txtUltTran = this.secuen.toString();
                if (await this.presentAlertConfirm("Desea Imprimir Resumen?")) {
                  this.ImprimirMultipaginas(this.secuen, "");
                }

                /* rs = true; */
                return resolveo(true);
                /* return rs; */
              } else {
                this.presentAlert("Error", resp.Description);
                return resolveo(false);

              }
            });

        });
        return resolve(r3);

      } catch (error) {
        this.presentAlert("Error", error);
        return resolve(false);

      }
    });
  }

  async LecturaCodigoBase() {
    return await new Promise(async (resolve) => {

      let rs: boolean = false;
      let UbicacionOrig: string;
      let tbCuarent: [][];
      let filasCuarent: number = 0;
      let cuaren: string = "";
      let codprodsulfito: string = "";
      let lotsulfito: string = "";
      let tallasulfito: string = "";
      let SSCCPadre: string = "";

      try {

        const cc = await new Promise(async (resolve) => {
          await this._dataService.getConsultaSSCC(this.txtSSCC).subscribe(async (resp) => {
            if (resp.Codigo) {

              if (Object.keys(resp.Dt).length <= 0) {
                this.presentAlert("Error", "No existe el codigo SSCC");
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(false);
              }

              let ds: [][] = resp.Dt.Table;
              let dso: [][] = resp.Dt.Table3;

              if (resp.Dt.Table.length <= 0) {
                this.presentAlert("Error", "No existen el codigo SSCC");
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(false);
              }
              this.prod = ds[0]["CODPRO"];
              this.tallas = ds[0]["TALLAS"];
              this.bodega = ds[0]["BODEGA"];
              this.estado = ds[0]["ESTADO"];
              this.SnInventariado = ds[0]["INVENTARIADO"];
              this.color = ds[0]["COLOR"];
              this.MIxcolor = (ds[0]["pro_MezclaColorxpallet"] === null ? "" : ds[0]["pro_MezclaColorxpallet"]);

              if (this.cmbTipoConv === "R" || this.cmbTipoConv === "P") {
                if (this.GMixcolor !== "") {
                  if (this.GMixcolor === "N") {
                    if (this.Gcolor !== this.color) {
                      await this.presentAlert("Error", "No se pueden mezclar colores de productos")
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return resolve(false);
                    }
                  }
                }
              }
              //ubicacion de origen
              let ds1: [][] = resp.Dt.Table1;
              if (ds1.length <= 0) {
                await this.presentAlert("Error", "No existen el codigo SSCC");
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(false);
              }

              UbicacionOrig = ds1[0]["ubica"];

              //color pallet
              let ds2: [][] = resp.Dt.Table2;
              if (ds2.length > 0) {
                if (ds2[0]["cuenta"] > 1) {
                  await this.presentAlert("Error", "No Se pueden mezclar colores en pallet");
                  this.txtScannedValue = "";
                  setTimeout(() => this.inputSSCC.setFocus(), 300);
                  return resolve(false);
                }
              }

              if (this.cmbTipo === "I") {
                //LA VALIDACION DE LA BODEGA LA HAGO DENTRO DEL SP
                const v1 = await new Promise(async (resolve) => {
                  await this._dataService.getVerificaLoteIQF(this.txtSSCC, (this.txt_referencia.toString().trim() === "" ? "0" : ""), this.cmbOrigen.toString().trim()).subscribe(async (resp) => {
                    if (resp.Codigo) {
                      if (Object.keys(resp.Dt).length > 0) {

                        let tb: [][] = resp.Dt.Table;
                        if (tb.length > 0) {
                          if (tb[0]["val"].toString().trim() === "N") {
                            await this.presentAlert("Error", "Lote no corresponde al secuencial");
                            this.txtScannedValue = "";
                            setTimeout(() => this.inputSSCC.setFocus(), 300);
                            return resolve(false);
                          }
                        }
                      }
                    } else {
                      await this.presentAlert("Error", resp.Description);
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return resolve(false);
                    }
                    return resolve(true);
                  });
                });
                if (!v1) {
                  return resolve(false);
                }
              }

              if (this.cmbTipo === "T") {
                const v2 = await new Promise(async (resolve) => {
                  await this._dataService.getVerifCuarentena(this.cmbOrigen.toString().trim(), this.txtSSCC).subscribe(async (resp) => {
                    if (resp.Codigo) {
                      if (Object.keys(resp.Dt).length > 0) {
                        tbCuarent = resp.Dt.Table;
                        filasCuarent = resp.Dt.Table.length;
                      }
                    } else {
                      this.presentAlert("Error", resp.Description);
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return resolve(false);
                    }
                    return resolve(true);
                  });
                });
                if (!v2) {
                  return resolve(false);
                }
              }

              if (this.cmbTipo === "T") {
                if (this.cmbDestino.substring(0, 1) === "X" || this.cmbDestino.toString().trim() === "CM" || this.cmbDestino.toString().trim() === "PL"
                  || this.cmbDestino.toString().trim() === "VA"
                  || this.cmbDestino.toString().trim() === "CS" || this.cmbDestino.toString().trim() === "TM" || this.chkCuarentena) {
                  for (let ic = 0; ic < ds.length; ic++) {

                    if (ds[ic]["autorizado"].toString().trim() !== "S") {
                      if (ds[ic]["sscc_cuarent"].toString().trim() !== "" || ds[ic]["autorizado"].toString().trim() === "N") {
                        if (ds[ic]["autorizado"].toString().trim() === "N") {
                          if (ds[ic]["Tipo_cuarent"].toString().trim() === "R") {
                            if (this.cmbDestino.toString().trim() === "PL" || this.cmbDestino.toString().trim() === "VA") {
                              cuaren = ds[ic]["sscc_cuarent"].toString().trim();
                              break;
                            }
                            else {
                              cuaren = "";
                            }
                          }
                          else {
                            if (ds[ic]["Tipo_cuarent"].toString().trim() === "S") {
                              if (codprodsulfito.toString().trim() !== ds[ic]["sscc_codprod"].toString().trim() &&
                                lotsulfito.toString().trim() !== ds[ic]["dsscc_lote"].toString().trim() &&
                                tallasulfito.toString().trim() !== ds[ic]["sscc_talla"].toString().trim()) {

                                if (!await this.presentAlertConfirm("Cuarentena de Sulfitos/Calidad desea Continuar?")) {
                                  cuaren = ds[ic]["sscc_cuarent"].toString().trim();
                                }
                                else {
                                  cuaren = ""

                                  codprodsulfito = ds[ic]["sscc_codprod"].toString().trim();
                                  lotsulfito = ds[ic]["dsscc_lote"].toString().trim();
                                  tallasulfito = ds[ic]["sscc_talla"].toString().trim();
                                }
                              }
                            }
                            else {
                              if (ds[ic]["Tipo_cuarent"].toString().trim() === "B") {
                                if (this.cmbDestino.toString().trim() === "PL" || this.cmbDestino.toString().trim() === "VA") {
                                  if (ds[ic]["preautorizado"].toString().trim() === "S") {
                                    cuaren = "";
                                  } else {
                                    cuaren = ds[ic]["sscc_cuarent"].toString().trim();
                                    break;
                                  }
                                } else {
                                  cuaren = ds[ic]["sscc_cuarent"].toString().trim();
                                  break;
                                }
                              }
                            }
                          }
                        }
                      }
                    }

                  }
                }
              }

              codprodsulfito = "";
              lotsulfito = "";
              tallasulfito = "";

              if (this.cmbTipo.toString().trim() === "E") {
                for (let ec = 0; ec < ds.length; ec++) {
                  if (ds[ec]["autorizado"].toString().trim() !== "S") {
                    if (ds[ec]["sscc_cuarent"].toString().trim() !== "" || ds[ec]["autorizado"].toString().trim() === "N") {
                      if (ds[ec]["Tipo_cuarent"].toString().trim() === "R") {
                        if (this.cmbDestino.toString().trim() === "PL") {
                          cuaren = ds[ec]["sscc_cuarent"].toString().trim();
                          break;
                        } else {
                          cuaren = "";
                        }
                      }
                      else {
                        if (ds[ec]["Tipo_cuarent"].toString().trim() === "S") {
                          if (codprodsulfito.toString().trim() !== ds[ec]["sscc_codprod"].toString().trim() &&
                            lotsulfito.toString().trim() !== ds[ec]["dsscc_lote"].toString().trim() &&
                            tallasulfito.toString().trim() !== ds[ec]["sscc_talla"].toString().trim()) {

                            if (!await this.presentAlertConfirm("Cuarentena de Sulfitos/Calidad desea Continuar?")) {
                              cuaren = ds[ec]["sscc_cuarent"].toString().trim();
                            } else {
                              cuaren = "";
                              codprodsulfito = ds[ec]["sscc_codprod"].toString().trim();
                              lotsulfito = ds[ec]["dsscc_lote"].toString().trim();
                              tallasulfito = ds[ec]["sscc_talla"].toString().trim();
                            }
                          }
                        } else {
                          cuaren = ds[ec]["sscc_cuarent"].toString().trim();
                          break;
                        }
                      }
                    }
                  }
                  cuaren = "";
                }
              }

              if (this.cmbTipo === "T") {
                if (filasCuarent > 0) {

                  if (tbCuarent[0]["ResMovCuarent"].toString().trim() === "N") {
                    if (this.chkCuarentena) {
                      if (cuaren.toString().trim() !== "") {
                        await this.presentAlert("Error", "Lote en Cuarentena, no lo puede exportar");
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      }
                    }
                  }
                }
              }

              if (this.cmbTipo === "E") {
                if (cuaren.toString().trim() !== "") {
                  await this.presentAlert("Error", "Lote en Cuarentena, no lo puede Egresar");
                  this.txtScannedValue = "";
                  setTimeout(() => this.inputSSCC.setFocus(), 300);
                  return resolve(false);
                }
              }

              if (this.estado.toString().trim() === "DE") {
                await this.presentAlert("Error", "Código de barras ya ha sido desarmado");
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(false);
              }

              if (this.estado.toString().trim() === "EG" && this.cmbTipo !== "I") {
                await this.presentAlert("Error", "Código de barras ya ha sido Egresado");
                this.txtScannedValue = "";
                setTimeout(() => this.inputSSCC.setFocus(), 300);
                return resolve(false);
              }

              if (this.codprod1.toString().trim() !== "") {
                if (this.cmbTipoConv.toString().trim() === "P" || this.cmbTipoConv.toString().trim() === "R") {
                  if ((this.codprod1.toString().trim() !== this.prod.toString().trim()) || (this.tallas.toString().trim() !== this.tallas1.toString().trim())) {

                    if (await !this.presentAlertConfirm("Código es diferente del anterior, Desea continuar?")) {
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return resolve(false);
                    }
                  }
                }
              }

              let bodOri: string = "";
              let bodDes: string = "";
              bodOri = this.cmbOrigen.toString().trim();
              if (this.cmbTipo.toString().trim() === "T") {
                bodDes = this.cmbDestino.toString().trim();
              }

              if (this.codprod1.toString().trim() !== "") {

                const v3 = await new Promise(async (resolve) => {
                  await this._dataService.getValidaPO(this.codprod1.toString().trim(), this.codsscc1.toString().trim(),
                    this.prod.toString().trim(), this.txtSSCC.toString().trim(), bodOri, bodDes).subscribe(async (resp) => {
                      if (resp.Codigo) {
                        if (Object.keys(resp.Dt).length > 0) {
                          let tbO1: [][] = resp.Dt.Table;
                          if (tbO1.length > 0) {
                            if (tbO1[0]["descri"].toString().trim() !== "") {
                              await this.presentAlert("Error", tbO1[0]["descri"].toString().trim());
                              this.txtScannedValue = "";
                              setTimeout(() => this.inputSSCC.setFocus(), 300);
                              return resolve(false);
                            }
                          }
                        }
                      } else {
                        await this.presentAlert("Error", resp.Description);
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      }
                      return resolve(true);
                    });
                });
                if (!v3) {
                  return resolve(false);
                }
              }

              //VALIDO LOTES UNIFICADOS

              const v4 = await new Promise(async (resolve) => {
                await this._dataService.getValidaUnif(this.cmbTipo.trim(), this.cmbMotivo.trim(), this.txtSSCC.toString().trim(),
                  bodOri, bodDes, (this.txt_referencia.trim() === "" ? "0" : this.txt_referencia.trim())).subscribe(async (resp) => {

                    if (resp.Codigo) {

                      if (Object.keys(resp.Dt).length > 0) {
                        let tb: [][] = resp.Dt.Table;
                        if (tb.length > 0) {
                          if (tb[0]["TIPO"].toString().trim() === "OK") {
                            this.txt_referencia = tb[0]["descri"].toString().trim();
                          } else {
                            await this.presentAlert("Error", tb[0]["descri"].toString().trim());
                            this.txtScannedValue = "";
                            setTimeout(() => this.inputSSCC.setFocus(), 300);
                            return resolve(false);
                          }
                        }
                      }
                    } else {
                      await this.presentAlert("Error", resp.Description);
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return resolve(false);
                    }
                    return resolve(true);
                  });
              });
              if (!v4) {
                return resolve(false);
              }

              if (!this.chkInvent) {
                if (ds[0]["SSCC_SnAgrupado"] !== null && ds[0]["SSCC_SnAgrupado"] !== undefined) {
                  if (ds[0]["SSCC_SnAgrupado"].toString().trim() === "S") {
                    if (dso.length > 0) {
                      SSCCPadre = dso[0]["dsscc_sscc"].toString().trim();
                    } else {
                      SSCCPadre = "";
                    }
                    //CAJAS DE MASTERS
                    if (this.cmbTipoConv !== "CM") {
                      if (SSCCPadre.toString().trim() !== this.btn_DesEmpaque.trim()) {
                        /* If MsgBox("Código se encuentra agrupado en pallet " & SSCCPadre & ". Desea Desarmarlo ", MsgBoxStyle.YesNo + MsgBoxStyle.Question, "Error de digitacion") = MsgBoxResult.Yes Then
                            prue = ComboBox2.SelectedItem
                            motivo = ver(prue) */
                        if (await this.presentAlertConfirm("Código se encuentra agrupado en pallet " + SSCCPadre.toString().trim() + ". Desea Desarmarlo?")) {
                          const v5 = await new Promise(async (resolve) => {
                            await this._dataService.GeneraMovimientosAuto("1", this.cmbOrigen, await this._log.getuser(), this.cmbMotivo, "S", "Desarme", this.txtSSCC).subscribe(async (resp) => {
                              if (!resp.Codigo) {
                                await this.presentAlert("Error", resp.Description);
                                this.txtScannedValue = "";
                                setTimeout(() => this.inputSSCC.setFocus(), 300);
                                return resolve(false);
                              }
                              return resolve(true);
                            });
                          });
                          if (!v5) {
                            return resolve(false);
                          }
                        }
                        /* End If */
                      } else {
                        if (this.cmbTipoConv !== "CM") {
                          await this.presentAlert("Error", "Código ya ha sido leído");
                        }
                      }

                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return rs;
                    }
                  }
                }
              } else {
                if (ds[0]["SSCC_SnAgrupado"] !== null && ds[0]["SSCC_SnAgrupado"] !== undefined) {
                  if (ds[0]["SSCC_SnAgrupado"].toString().trim() === "S") {
                    if (dso.length > 0) {
                      SSCCPadre = dso[0]["dsscc_sscc"].toString().trim();
                    } else {
                      SSCCPadre = "";
                    }

                    if (SSCCPadre.toString().trim() !== this.btn_DesEmpaque.trim()) {

                      if (await this.presentAlertConfirm("Código se encuentra agrupado en pallet " + SSCCPadre.toString().trim() + ". Desea Desarmarlo?")) {
                        const v6 = await new Promise(async (resolve) => {
                          await this._dataService.GeneraMovimientosAuto("1", this.cmbOrigen, await this._log.getuser(), this.cmbMotivo, "S",
                            "Desarme", this.txtSSCC).subscribe(async (resp) => {
                              if (!resp.Codigo) {
                                await this.presentAlert("Error", resp.Description);
                                this.txtScannedValue = "";
                                setTimeout(() => this.inputSSCC.setFocus(), 300);
                                return resolve(false);
                              }
                              return resolve(true);
                            });
                        });

                        if (!v6) {
                          return resolve(false);
                        }
                      }

                    } else {
                      await this.presentAlert("Error", "Producto ya se encuentra asignado a este pallet");
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return rs;
                    }
                  }
                }
              }

              if (!this.chkInvent) {
                if (this.cmbMotivo.trim() === "EXA") {
                  const v7 = await new Promise(async (resolve) => {
                    await this._dataService.ValidaCuarentenaxSSCC(this.txtSSCC).subscribe(async (resp) => {
                      if (resp.Codigo) {
                        if (Object.keys(resp.Dt).length > 0) {
                          if (resp.Dt.Table.length > 0) {
                            if (!await this.presentAlertConfirm("Producto se encuentra en cuarentena, desea continuar?")) {
                              this.txtScannedValue = "";
                              setTimeout(() => this.inputSSCC.setFocus(), 300);
                              return resolve(false);
                            }
                          }
                        }
                      } else {
                        await this.presentAlert("Error", resp.Description);
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      }
                      return resolve(true);
                    });
                  });
                  if (!v7) {
                    return resolve(false);
                  }
                }
              }

              if (this.cmbTipo !== "I") {
                if (this.bodega.trim() !== "") {
                  if (this.bodega.trim() !== this.cmbOrigen.trim()) {
                    /* If MsgBox("Producto no consta en esta bodega " & bodega & ". Desea Transferirlo ", MsgBoxStyle.YesNo + MsgBoxStyle.Question, "Error de digitacion") = MsgBoxResult.Yes Then */
                    if (await this.presentAlertConfirm("Producto no consta en esta bodega " + this.bodega.trim() + ". Desea Transferirlo?")) {
                      const v8 = await new Promise(async (resolve) => {
                        await this._dataService.GeneraMovimientosAuto("1", this.cmbOrigen.toString().trim() + this.cmbUbicacion.trim(), await this._log.getuser(),
                          this.cmbMotivo, "N", "", this.txtSSCC).subscribe(async (resp) => {
                            if (!resp.Codigo) {
                              await this.presentAlert("Error", resp.Description);
                              this.txtScannedValue = "";
                              setTimeout(() => this.inputSSCC.setFocus(), 300);
                              return resolve(false);
                            }
                            return resolve(true);
                          });
                      });
                      if (!v8) {
                        return resolve(false);
                      }
                    }

                    /*  End If */
                    this.txtScannedValue = "";
                    setTimeout(() => this.inputSSCC.setFocus(), 300);
                    return resolve(false);
                  }
                }

                if (this.chkSaldos) {
                  if (!await this.VerificaSaldos(this.txtSSCC, this.cmbOrigen.trim())) {
                    this.txtScannedValue = "";
                    setTimeout(() => this.inputSSCC.setFocus(), 300);
                    return rs;
                  }
                }

                const v9 = await new Promise(async (resolve) => {
                  await this._dataService.ValidaSaldoxSSCC(this.txtSSCC, "1", this.cmbOrigen.trim()).subscribe(async (resp) => {
                    if (resp.Codigo) {

                      if (Object.keys(resp.Dt).length > 0) {
                        let strRes: [][] = resp.Dt.Table;
                        let valResp: string = "NO";
                        if (strRes.length > 0) {
                          if (strRes[0]["val"].toString().trim() === "SI") {
                            valResp = "SI";
                          }
                        }
                        if (this.chkSaldos) {
                          if (valResp !== "SI") {
                            await this.presentAlert("Error", "No existe Saldo");
                            this.txtScannedValue = "";
                            setTimeout(() => this.inputSSCC.setFocus(), 300);
                            this._dataService.EnvioCorreoSinSaldo(this.prod, this.tallas, "NNNN", await this._log.getuser()).subscribe((resp) => {
                            });
                            return resolve(false);
                          }
                        }
                      }
                    }
                    else {
                      await this.presentAlert("Error", resp.Description);
                      this.txtScannedValue = "";
                      setTimeout(() => this.inputSSCC.setFocus(), 300);
                      return resolve(false);
                    }
                    return resolve(true);
                  });
                });

                if (!v9) {
                  return resolve(false);
                }

              } else {
                if (!this.chkInvent) {
                  if (this.bodega.trim() !== "") {
                    await this.presentAlert("Advertencia", "Ya se encuentra registrado el producto en inventario en la bodega " + this.bodega.trim());
                    this.txtScannedValue = "";
                    setTimeout(() => this.inputSSCC.setFocus(), 300);
                    return resolve(false);
                  }
                  else {
                    if (this.cmbMotivo.trim() !== "TI") {
                      if (this.bodega.trim() === this.cmbOrigen.trim()) {
                        await this.presentAlert("Advertencia", "Ya se encuentra registrado el producto en inventario en la bodega " + this.bodega.trim());
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      }
                    } else {
                      if (this.SnInventariado.trim() === "S") {
                        await this.presentAlert("Advertencia", "Ya se encuentra registrado el producto en inventario en la bodega " + this.bodega.trim());
                        this.txtScannedValue = "";
                        setTimeout(() => this.inputSSCC.setFocus(), 300);
                        return resolve(false);
                      }
                    }
                  }
                }
              }

              this.Gcolor = this.color;
              this.GMixcolor = this.MIxcolor;
              return resolve(true);
            } else {
              await this.presentAlert("Error", resp.Description);
              return resolve(false);
            }
          });
        });

        return resolve(cc);
      } catch (error) {
        await this.presentAlert("Error", error);
        resolve(false);
      }
      return resolve(true);

    });

  }

  async generar() {
    let rs: boolean = false;
    try {
      let bodega: string = "";
      if (this.cmbTipo.trim() === "T") {
        bodega = this.cmbOrigen.trim();
      }

      const v1 = await new Promise(async (resolve) => {
        await this._dataService.GrabarSSCCPalletNew(bodega, await this._log.getuser()).subscribe(async (resp) => {
          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              let strRes: [][] = resp.Dt.Table;
              if (strRes.length > 0) {
                this.ssccp = strRes[0]["sscc"].toString().trim();
                if (this.ssccp.length !== 18) {
                  return resolve(false);
                }
              }
            }
          } else {
            await this.presentAlert("Error", resp.Description);
            return resolve(false);
          }
          return resolve(true);
        });
      });
      if (!v1) {
        return rs;
      }

      this.btn_DesEmpaque = this.ssccp;
      rs = true;
      return rs;

    } catch (error) {
      this.txtScannedValue = "";
      setTimeout(() => this.inputSSCC.setFocus(), 300);
      await this.presentAlert("Error", error);
    }
    return rs;
  }

  async VerificaSaldos(cod, bod) {
    let clave: string;
    let rs: boolean = false;
    let produc1: string;
    let talla1: string;
    let lote1: string;
    let saldo1: number;
    let acum1: number;
    let msgacumulado: number;
    let saldo: ClsProducto = {
      id: "",
      producto: "",
      talla: -1,
      lote: "",
      saldo: 0,
      acumulado: 0
    };
    try {
      const v1 = await new Promise(async (resolve) => {
        await this._dataService.getVerificaSaldoSSCC(cod, "1", bod).subscribe(async (resp) => {
          if (resp.Codigo) {

            if (Object.keys(resp.Dt).length > 0) {
              let strRes: [][] = resp.Dt.Table;
              if (strRes.length > 0) {
                for (let ii = 0; ii < strRes.length; ii++) {
                  //debugger;
                  produc1 = strRes[ii]["tcd_produc"].toString().trim();
                  talla1 = strRes[ii]["tcd_codtal"].toString().trim();
                  lote1 = strRes[ii]["tcd_lote"].toString().trim();
                  acum1 = strRes[ii]["tcd_cantid"];
                  saldo1 = strRes[ii]["Saldo"];
                  if (saldo1 < acum1) {
                    this.presentAlert("Error", "No existe saldo para el lote " + lote1);
                    this._dataService.EnvioCorreoSinSaldo(produc1, talla1, lote1, await this._log.getuser()).subscribe((resp) => {
                    });
                    return resolve(false);
                  }
                  clave = produc1.trim() + ":" + talla1.trim() + ":" + lote1.trim();
                  if (this.colSaldoProd.length > 0) {

                    saldo = this.colSaldoProd.find(r => r.id === clave);
                    if (saldo === null || saldo === undefined) {
                      saldo = {
                        id: "",
                        producto: "",
                        talla: -1,
                        lote: "",
                        saldo: 0,
                        acumulado: 0
                      };
                      saldo.id = clave;
                      saldo.lote = lote1;
                      saldo.producto = produc1;
                      saldo.talla = Number(talla1);
                      saldo.saldo = saldo1;
                      saldo.acumulado = acum1;
                      this.colSaldoProd.push(saldo);
                    } else {
                      saldo.saldo = saldo1;
                      if (saldo1 < saldo.acumulado + acum1) {
                        msgacumulado = saldo.acumulado + acum1;
                        this.presentAlert("Error", "No existe saldo lote " + lote1 + " Saldo: " + saldo1.toString() + " Acumulado:" + msgacumulado.toString());
                        this._dataService.EnvioCorreoSinSaldo(produc1.trim(), talla1.trim(), lote1.trim(), await this._log.getuser()).subscribe((resp) => { });
                        return resolve(false);
                      }
                      saldo.acumulado = saldo.acumulado + acum1;
                    }
                  }
                  else {
                    saldo.id = clave;
                    saldo.lote = lote1;
                    saldo.producto = produc1;
                    saldo.talla = Number(talla1);
                    saldo.saldo = saldo1;
                    saldo.acumulado = saldo.acumulado + acum1;
                    this.colSaldoProd.push(saldo);
                  }
                }
              }
            }
          } else {
            this.presentAlert("Error", resp.Description);
            return resolve(false);
          }
          return resolve(true);
        });
      });

      return v1;

    } catch (error) {
      rs = false;
      this.presentAlert("Error", error);
    }
    return rs;
  }

  async AniadirMasteraPallet(ssccpallet, lote, dsscc_numero) {
    return await new Promise(async (resolve) => {

      try {
        if (this.cmbTipoConv.toString().trim() !== "P" && this.cmbTipoConv.toString().trim() !== "R") {
          return resolve(true);
        }
        if (this.tipoEtiqueta === "P") {
          await this.presentAlert("Error", "Aqui quiso añadir pallets a pallets");
          return resolve(false);
        }
        else {

          let a1 = await new Promise(async (resolve) => {
            //aqui ya esta incluido agrupar detalle
            await this._dataService.guardadet(ssccpallet, "", dsscc_numero).subscribe(async (resp) => {

              if (!resp.Codigo) {
                await this.presentAlert("Error", resp.Description);
                return resolve(false);
              }
              return resolve(true);
            });
          });


          if (!a1) {
            return resolve(false);
          }

          this.codprod1 = this.prod;
          this.tallas1 = this.tallas;
          this.codsscc1 = dsscc_numero;

          return resolve(true);
        }
      } catch (error) {

        await this.presentAlert("Error", error);
        this.txtScannedValue = "";
        setTimeout(() => this.inputSSCC.setFocus(), 300);
        return resolve(false);
      }

    });
  }

  async AñadirFilaalGrid(opcion) {
    try {
      this.num1 = this.num1 + 1;
      let r_dt: tb_DataGrid = { "sscc": "", "num": 0, "ssccp": "", "ubic": "" };
      if (this.cmbTipoConv.trim() === "P") {
        if (opcion.trim() === "Nuevo") {
          r_dt.sscc = this.ssccp;
        } else {
          r_dt.sscc = this.txtSSCC;
        }
      } else {
        r_dt.sscc = this.txtSSCC;
      }


      r_dt.num = this.num;
      r_dt.ssccp = "";
      r_dt.ubic = this.cmbUbicacion;
      this.DataGrid.push(r_dt);
      this.DataGrid = JSON.parse(JSON.stringify(this.DataGrid));

      this.txt_pallets = this.num1.toString();
      this.num = this.num + 1;
    } catch (error) {
      this.presentAlert("Error", error);
    }
  }

  async imprimirMaster() {
    try {
      await this.showLoading("Imprimiendo...");
      let rsPrint: any = false;

      const v1 = await new Promise(async (resolve) => {
        await this._dataService.getDataImpresionMaster("MASTER", this.num1, this.descri, this.detTalla, this.sscc, this.CantLote,
          this.detLoteImp, this.prod, await this._log.getuser(), this.Caduca).subscribe(async (resp) => {
            if (resp.Codigo) {
              if (Object.keys(resp.Dt).length > 0) {
                let strRes: [][] = resp.Dt.Table;
                /* PRINT */
                if (strRes.length > 0) {
                  //console.log(strRes[0]["Printer"]);
                  rsPrint = await this._dataService.printer(strRes[0]["Printer"], await this._param.getvaluesMac());
                  if (rsPrint) {
                    await this.presentAlert("Información", "Impresión realizada");
                  }
                }
              }
            } else {
              await this.presentAlert("Error", resp.Description);
              return resolve(false);
            }
            return resolve(true);
          });
      });
    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }

  async imprimirLote() {
    try {

      await this.showLoading("Imprimiendo...");
      let lotes: string = "";
      let salto: number = 100;
      let rsPrint: any = false;

      Object.keys(this.DetLote.items).forEach(element => {
        if (Object.keys(this.DetLote.items).length >= 5) {
          lotes = lotes + "T 7 7 100 " + salto.toString() + " " + element + " - " + this.DetLote.items[element].toString() + String.fromCharCode(13) + String.fromCharCode(10);
          salto = salto + 50;
        } else {
          lotes = lotes + "T 4 2 100 " + salto.toString() + " " + element + " - " + this.DetLote.items[element].toString() + String.fromCharCode(13) + String.fromCharCode(10);
          salto = salto + 100;
        }
      });
      const v1 = await new Promise(async (resolve) => {
        await this._dataService.getDataImpresionLotes(lotes).subscribe(async (resp) => {
          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              let strRes: [][] = resp.Dt.Table;
              /* PRINT */
              if (strRes.length > 0) {
                //console.log(strRes[0]["Printer"]);
                rsPrint = await this._dataService.printer(strRes[0]["Printer"], await this._param.getvaluesMac());
                if (rsPrint) {
                  await this.presentAlert("Información", "Impresión realizada");
                }
              }
            }
          } else {
            await this.presentAlert("Error", resp.Description);
            return resolve(false);
          }
          return resolve(true);
        });
      });
    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }

  async ImprimirMultipaginas(Numero, Tipo) {
    try {
      await this.showLoading("Imprimiendo...");

      let imp: string = "";
      let salto: number = 170;
      let DetInv: boolean = false;
      let Talla: string;
      let Descripcion: string = "";
      let DatoAnt: string = "";
      let primera: boolean = true;
      let TotMas: number = 0;
      let rsPrint: any = false;

      DetInv = (await this._param.getvaluesInventario() == 'true');

      if (this.chkMatricial) {
        const v1 = await new Promise(async (resolve) => {
          await this._dataService.getImpresionMatricial(Numero).subscribe(async (resp) => {
            if (resp.Codigo) {
              await this.presentAlert("Información", "Enviada a la cola de impresion");
            } else {
              await this.presentAlert("Error", resp.Description);
            }
            return resolve(true);
          });
        });
        this.hideLoading();
        return;
      }

      const v2 = await new Promise(async (resolve) => {
        await this._dataService.getImpresionMultiPag(Tipo, Numero).subscribe(async (resp) => {
          if (resp.Codigo) {

            if (Object.keys(resp.Dt).length > 0) {
              let ds: [][] = resp.Dt.Table;
              /* await this._dataService.printer2(ds[0]["PRINTER"], await this._param.getvaluesMac());
              return resolve(true); */
              let tamano = "! 0 200 200 800 1"
              if (ds.length > 0) {
                tamano = ds[0]["tamano"].toString().trim();
              }
              imp = tamano + String.fromCharCode(13) + String.fromCharCode(10) + "LABEL" + String.fromCharCode(13) + String.fromCharCode(10) + "CONTRAST 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                "TONE 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                "SPEED 5" + String.fromCharCode(13) + String.fromCharCode(10) +
                "PAGE-WIDTH 560" + String.fromCharCode(13) + String.fromCharCode(10) +
                "PAGE-HEIGHT 800" + String.fromCharCode(13) + String.fromCharCode(10) +
                "BAR-SENSE" + String.fromCharCode(13) + String.fromCharCode(10) +
                ";// PAGE 0000000005600800" + String.fromCharCode(13) + String.fromCharCode(10) +
                "T 7 0 22 145                                          " + String.fromCharCode(13) + String.fromCharCode(10) +
                "T 7 0 65 84 [" + Numero + "]" + String.fromCharCode(13) + String.fromCharCode(10)

              for (let index = 0; index < ds.length; index++) {
                if (salto >= 750) {
                  imp = imp + "BT OFF" + String.fromCharCode(13) + String.fromCharCode(10) +
                    "BT 0 1 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                    "BT OFF" + String.fromCharCode(13) + String.fromCharCode(10) +
                    "PRINT" + String.fromCharCode(13) + String.fromCharCode(10);
                  console.log(imp);
                  /* Retorno = Print(Buffer.ToString) */
                  rsPrint = await this._dataService.printer(imp, await this._param.getvaluesMac());

                  if (!rsPrint) {
                    return resolve(true);
                  }

                  imp = "";
                  if (DetInv) {
                    imp = imp + tamano + String.fromCharCode(13) + String.fromCharCode(10) + "LABEL" + String.fromCharCode(13) + String.fromCharCode(10) + "CONTRAST 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "TONE 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "SPEED 5" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "PAGE-WIDTH 560" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "PAGE-HEIGHT 800" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "BAR-SENSE" + String.fromCharCode(13) + String.fromCharCode(10) +
                      ";// PAGE 0000000005600800" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "T 7 0 22 145 Producto              lote  Cajas   Mstr" + String.fromCharCode(13) + String.fromCharCode(10);
                  } else {
                    imp = imp + tamano + String.fromCharCode(13) + String.fromCharCode(10) + "LABEL" + String.fromCharCode(13) + String.fromCharCode(10) + "CONTRAST 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "TONE 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "SPEED 5" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "PAGE-WIDTH 560" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "PAGE-HEIGHT 800" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "BAR-SENSE" + String.fromCharCode(13) + String.fromCharCode(10) +
                      ";// PAGE 0000000005600800" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "T 7 0 22 145                                          " + String.fromCharCode(13) + String.fromCharCode(10);
                  }
                  salto = 170;
                }
                Talla = ds[index]["tal_descri"].toString().trim();

                if (DetInv) {
                  Descripcion = ds[index]["pro_codcor"].toString().trim() + " " + ds[index]["pro_desesp"].toString().trim();
                } else {
                  Descripcion = ds[index]["pro_codcor"].toString().trim() + " " + "                    ";
                }

                Descripcion = (Descripcion + "                     ").substring(0, 20);
                Descripcion = Descripcion + " " + Talla.trim();
                if (DatoAnt !== Descripcion) {
                  if (!primera) {
                    imp = imp + "T 7 0 290 " + salto.toString() + "      ->" + String.fromCharCode(13) + String.fromCharCode(10) +
                      "T 7 0 445 " + salto.toString() + " " + TotMas.toString() + String.fromCharCode(13) + String.fromCharCode(10);

                    TotMas = 0;
                    salto = salto + 30;
                  }
                  DatoAnt = Descripcion;
                  imp = imp + "T 7 0 25 " + salto.toString() + " " + Descripcion + String.fromCharCode(13) + String.fromCharCode(10);
                  primera = false;
                  salto = salto + 30;
                }

                imp = imp + "T 0 2 290 " + salto.toString() + " " + ds[index]["tcd_lote"].toString().trim() + String.fromCharCode(13) + String.fromCharCode(10) +
                  "T 0 2 390 " + salto.toString() + " " + ds[index]["cajas"].toString().trim() + String.fromCharCode(13) + String.fromCharCode(10) +
                  "T 0 2 445 " + salto.toString() + " " + ds[index]["master"].toString().trim() + String.fromCharCode(13) + String.fromCharCode(10);

                TotMas = TotMas + Number(ds[index]["master"]);
                salto = salto + 30;
              }

              imp = imp + "T 7 0 290 " + salto.toString() + "      ->" + String.fromCharCode(13) + String.fromCharCode(10) +
                "T 7 0 445 " + salto.toString() + " " + TotMas.toString() + String.fromCharCode(13) + String.fromCharCode(10)

              primera = false;
              TotMas = 0;
              imp = imp + "BT OFF" + String.fromCharCode(13) + String.fromCharCode(10) +
                "BT 0 1 0" + String.fromCharCode(13) + String.fromCharCode(10) +
                "BT OFF" + String.fromCharCode(13) + String.fromCharCode(10) +
                "PRINT" + String.fromCharCode(13) + String.fromCharCode(10);

              /* console.log(imp); */
              rsPrint = await this._dataService.printer(imp, await this._param.getvaluesMac());
              /* Retorno = Print(Buffer.ToString) */
              imp = "";

              if (rsPrint) {
                await this.presentAlert("Información", "Impresión realizada");
              }
            }

          } else {
            await this.presentAlert("Error", resp.Description);
          }
          return resolve(true);
        });
      });


    } catch (error) {
      await this.presentAlert("Error", error);
    }

    this.hideLoading();
  }

  async imprimirpall(pallet) {
    try {

      await this.showLoading("Imprimiendo...");
      let OcultaTitulo: string = ((await this._param.getvaluesOculta() == 'true') ? "S" : "");
      let rsPrint: any = false;

      const v1 = await new Promise(async (resolve) => {
        await this._dataService.getImpresionPallet(pallet, OcultaTitulo).subscribe(async (resp) => {
          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              let strRes: [][] = resp.Dt.Table;
              /* PRINT */
              if (strRes.length > 0) {
                console.log(strRes[0]["Printer"]);
                rsPrint = await this._dataService.printer(strRes[0]["Printer"], await this._param.getvaluesMac());
                if (rsPrint) {
                  await this.presentAlert("Información", "Impresión realizada");
                }
              }
            }
          } else {
            await this.presentAlert("Error", resp.Description);
          }
          return resolve(true);
        });
      });

    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }

  async LlenarUbicacion(bod) {
    try {
      this.cmbUbicacion = "";
      this.dataComboUbicacion = null;

      const v1 = await new Promise(async (resolve) => {
        this._dataService.getUbicacion("1", bod, await this._log.getuser()).subscribe(async (resp) => {
          if (resp.Codigo) {
            if (Object.keys(resp.Dt).length > 0) {
              this.dataComboUbicacion = resp.Dt.Table;
              if (resp.Dt.Table.length <= 0) {
                await this.presentAlert("Advertencia", "No existen ubicaciones para esta bodega");
              }
            } else {
              await this.presentAlert("Advertencia", "No existen ubicaciones para esta bodega");
            }
          } else {
            await this.presentAlert("Error", resp.Description);
          }
          return resolve(true);
        });
      });

    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }

  async OnclickDesEmpaque() {
    try {

      //this.btn_DesEmpaque = "378612067302448243";
      if (this.btn_DesEmpaque !== "") {
        let navigationExtras: NavigationExtras = {
          state: {
            sscc: this.btn_DesEmpaque,
            resumido: "S",
            consulta: ""
          }
        }

        this.router.navigate(['app/transacciones/detalle-consulta'], navigationExtras);
      }
    } catch (error) {
      await this.presentAlert("Error", error);
    }
  }
}


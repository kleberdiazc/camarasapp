import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { ResultWS } from './../interfaces/interfaces';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { URL_CONSULT, URL_TRANSACIMAGEN, CONNECTION_PROD } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  constructor(private http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    private btSerial: BluetoothSerial
    , private alertCtrl: AlertController) { }

  connectBT(address) {
    return this.btSerial.connect(address);
  }

  async printer(dataPrint, address) {
    return new Promise(async (resolve) => {
      let xyz = await this.connectBT(address).subscribe(async data => {
        if (data === "OK") {
          await this.btSerial.write(dataPrint).then(async dataz => {
            xyz.unsubscribe();
            return resolve(true);
          }, async errx => {
            xyz.unsubscribe();
            let mno = await this.alertCtrl.create({
              header: "Error Impresión ",
              message: errx,
              buttons: ['OK']
            });
            await mno.present();

            return resolve(false);
          });
        }
      }, async err => {
        let mno = await this.alertCtrl.create({
          header: "Error Conexión ",
          message: err,
          buttons: ['OK']
        });
        await mno.present();
        return resolve(false);
      });
    });
  }

  getDataInitial() {

    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": "TIPO" }];

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const base = {
      sp: 'SP_COMBOSTRANSACC_APP',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);

  }

  getDataMotivo(mov, user) {

    const ListParam = [{ "Name": "TIPO", "Type": "Varchar", "Value": "MOTIVO" },
    { "Name": "MOV", "Type": "Varchar", "Value": mov },
    { "Name": "USUARIO", "Type": "Varchar", "Value": user/* this.storage.get('id_usuario') */ }];

    const base = {
      sp: 'SP_COMBOSTRANSACC_APP',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getDataChofer(Trans) {

    const ListParam = [{ "Name": "CODIGO", "Type": "Varchar", "Value": Trans }];

    const base = {
      sp: 'SP_CARGACHOFER',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getDataValidaCaja(codigo) {
    console.log("10");
    const ListParam = [{ "Name": "CODIGO", "Type": "Varchar", "Value": codigo }];

    const base = {
      sp: 'SP_VALIDA_CAJA',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getGenerarm(prodx, talla, tallavta, user) {
    console.log("9");
    const ListParam = [{ "Name": "Bodega", "Type": "Varchar", "Value": "" },
    { "Name": "operador", "Type": "Varchar", "Value": user },
    { "Name": "SSCC_CodProd", "Type": "Varchar", "Value": prodx },
    { "Name": "SSCC_Talla", "Type": "Varchar", "Value": talla },
    { "Name": "SSCC_TallaVta", "Type": "Varchar", "Value": tallavta }];

    const base = {
      sp: 'spr_GrabarSSCCMaster',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getTipoSSCC(sscc) {
    console.log("8");
    const ListParam = [{ "Name": "CODIGO", "Type": "Varchar", "Value": sscc }];

    const base = {
      sp: 'sp_gettiposscc',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getDetallePallet(sscc) {
    console.log("7");
    const ListParam = [{ "Name": "CODIGO", "Type": "Varchar", "Value": sscc }];

    const base = {
      sp: 'spr_DetallePallet',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getSecuencial(tipo) {
    console.log("6");
    const ListParam = [{ "Name": "trs_codigo", "Type": "Varchar", "Value": tipo }];

    const base = {
      sp: 'spr_Secuencial',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getExistenciaTra(sec) {
    console.log("5");
    console.log(sec);
    const ListParam = [{ "Name": "SECUEN", "Type": "Varchar", "Value": sec.toString().trim() }];

    const base = {
      sp: 'SP_VALIDO_EXITES_SSCC',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getConsultaSSCC(sscc) {
    console.log("4");
    const ListParam = [{ "Name": "CODIGO", "Type": "Varchar", "Value": sscc }];

    const base = {
      sp: 'SP_VALIDA_INFO_TRANSA',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getVerificaLoteIQF(sscc, ref, origen) {
    console.log("3");
    const ListParam = [{ "Name": "codigo", "Type": "Varchar", "Value": sscc },
    { "Name": "ref", "Type": "Varchar", "Value": ref },
    { "Name": "origen", "Type": "Varchar", "Value": origen }];

    const base = {
      sp: 'SP_CALLVerificaLoteotrIqf',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getVerifCuarentena(origen, sscc) {
    console.log("2");
    const ListParam = [{ "Name": "BODEGA", "Type": "Varchar", "Value": origen },
    { "Name": "SSCC", "Type": "Varchar", "Value": sscc }];

    const base = {
      sp: 'SP_VERIF_CUARENT_BODEGA',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getValidaPO(codprod1, codsscc1, prod, cod, bodoriPO, boddesPO) {
    console.log("1");
    const ListParam = [{ "Name": "COD1", "Type": "VarChar", "Value": codprod1 },
    { "Name": "SSCC1", "Type": "VarChar", "Value": codsscc1 },
    { "Name": "COD2", "Type": "VarChar", "Value": prod },
    { "Name": "SSCC2", "Type": "VarChar", "Value": cod },
    { "Name": "BODORI", "Type": "VarChar", "Value": bodoriPO },
    { "Name": "BODDES", "Type": "VarChar", "Value": boddesPO }];

    const base = {
      sp: 'SP_VALIDA_PO_PROD',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }


  GrabaMovimiento(sec, motivo, tipo, planta, origen, destino, refer, observa, conver, tipo_conver, opera, userrec, movil, sello, chofer, factura, maquina, xml) {
    const ListParam = [{ "Name": "secue", "Type": "NVarChar", "Value": sec },
    { "Name": "motivo", "Type": "VarChar", "Value": motivo },
    { "Name": "codtipo", "Type": "VarChar", "Value": tipo },
    { "Name": "planta", "Type": "NVarChar", "Value": planta },
    { "Name": "camaor", "Type": "VarChar", "Value": origen },
    { "Name": "plantad", "Type": "NVarChar", "Value": planta },
    { "Name": "camades", "Type": "VarChar", "Value": destino },
    { "Name": "compro", "Type": "VarChar", "Value": refer },
    { "Name": "estado", "Type": "VarChar", "Value": "AC" },
    { "Name": "observacion", "Type": "VarChar", "Value": observa },
    { "Name": "trc_snconver", "Type": "VarChar", "Value": conver },
    { "Name": "trc_proconver", "Type": "VarChar", "Value": tipo_conver },
    { "Name": "trc_resp", "Type": "VarChar", "Value": opera },
    { "Name": "trc_resprec", "Type": "VarChar", "Value": userrec },
    { "Name": "trc_movil", "Type": "VarChar", "Value": movil },
    { "Name": "trc_sello", "Type": "VarChar", "Value": sello },
    { "Name": "trc_chofer", "Type": "NVarChar", "Value": chofer },
    { "Name": "trc_factura", "Type": "VarChar", "Value": factura },
    { "Name": "maquina", "Type": "VarChar", "Value": maquina },
    { "Name": "version", "Type": "VarChar", "Value": "V3" },
    { "Name": "xml", "Type": "Xml", "Value": xml }];

    const base = {
      sp: 'spr_GrabarTransaccion_Songa_Movil',
      param: ListParam,
      conexion: CONNECTION_PROD
    };


    var formdata = new FormData();
    formdata.append("param", JSON.stringify(base));
    formdata.append("paramImagen", "{}");


    return this.http.post<ResultWS>(URL_TRANSACIMAGEN, formdata);
  }

  GeneraMovimientosAuto(planta, Camara, User, tipo, snconver, proconver, numeroSSCC) {
    const ListParam = [{ "Name": "trc_codpla", "Type": "NVarChar", "Value": planta },
    { "Name": "trc_codcam", "Type": "VarChar", "Value": Camara },
    { "Name": "trc_resp", "Type": "VarChar", "Value": User },
    { "Name": "trc_tipo", "Type": "VarChar", "Value": tipo },
    { "Name": "trc_snconver", "Type": "Char", "Value": snconver },
    { "Name": "trc_proconver", "Type": "VarChar", "Value": proconver },
    { "Name": "sscc_numero", "Type": "VarChar", "Value": numeroSSCC },
    { "Name": "version", "Type": "VarChar", "Value": "V3" }];

    const base = {
      sp: 'spr_AutoTransacSSCC',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  ValidaCuarentenaxSSCC(sscc) {
    const ListParam = [{ "Name": "sscc_codigo", "Type": "Varchar", "Value": sscc }];

    const base = {
      sp: 'Spr_ValidaCuarentenaxSSCC',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  ValidaSaldoxSSCC(sscc, planta, origen) {
    const ListParam = [{ "Name": "sscc_codigo", "Type": "VarChar", "Value": sscc },
    { "Name": "planta", "Type": "NVarChar", "Value": planta },
    { "Name": "bodega", "Type": "VarChar", "Value": origen }];

    const base = {
      sp: 'Spr_ValidaSaldoProductoSSCC',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  EnvioCorreoSinSaldo(prod, talla, bodega, User) {
    const ListParam = [{ "Name": "sscc_codigo", "Type": "VarChar", "Value": prod },
    { "Name": "planta", "Type": "NVarChar", "Value": talla },
    { "Name": "bodega", "Type": "VarChar", "Value": bodega }];

    const base = {
      sp: 'Spr_envioautomcorreosinsaldo',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  GrabarSSCCPalletNew(bodega, user) {
    const ListParam = [{ "Name": "bodega", "Type": "VarChar", "Value": bodega },
    { "Name": "operador", "Type": "VarChar", "Value": user }];

    const base = {
      sp: 'spr_GrabarSSCCPalletNew',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  getVerificaSaldoSSCC(sscc, planta, bodega) {
    const ListParam = [{ "Name": "sscc_codigo", "Type": "VarChar", "Value": sscc },
    { "Name": "planta", "Type": "NVarChar", "Value": planta },
    { "Name": "bodega", "Type": "VarChar", "Value": bodega }];

    const base = {
      sp: 'Spr_ConsSaldoProductoSSCC',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  SSCC_GuardaDetMaster(sscc, lote, cantidad) {
    const ListParam = [{ "Name": "sscc", "Type": "VarChar", "Value": sscc.toString() },
    { "Name": "lote", "Type": "VarChar", "Value": lote.toString() },
    { "Name": "Cantidad", "Type": "NVarChar", "Value": cantidad.toString() }];

    const base = {
      sp: 'spr_adddetmaster',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  guardadet(ssccPallet, lote, dsscc_numero) {
    const ListParam = [{ "Name": "dsscc_sscc", "Type": "VarChar", "Value": ssccPallet },
    { "Name": "dsscc_lote", "Type": "VarChar", "Value": lote },
    { "Name": "dsscc_numero", "Type": "NVarChar", "Value": dsscc_numero }];

    const base = {
      sp: 'SP_GRABA_DET',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //IMPRESION MASTERS
  getDataImpresionMaster(tipo, num1, descri, dettalla, sscc, cantlote, detloteimp, prod, elaborado, caduca) {
    const ListParam = [{ "Name": "TIPO", "Type": "VarChar", "Value": tipo.toString() },
    { "Name": "num1", "Type": "VarChar", "Value": num1.toString() },
    { "Name": "descri", "Type": "VarChar", "Value": descri.toString() },
    { "Name": "detTalla", "Type": "VarChar", "Value": dettalla.toString() },
    { "Name": "sscc", "Type": "VarChar", "Value": sscc.toString() },
    { "Name": "CantLote", "Type": "NVarChar", "Value": cantlote.toString() },
    { "Name": "detLoteImp", "Type": "VarChar", "Value": detloteimp },
    { "Name": "prod", "Type": "VarChar", "Value": prod.toString() },
    { "Name": "elaborado", "Type": "VarChar", "Value": elaborado.toString() },
    { "Name": "Caduca", "Type": "VarChar", "Value": caduca.toString() }];

    const base = {
      sp: 'SP_IMPRIME_TRANSCAMARA',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //IMPRESION LOTES
  getDataImpresionLotes(lotes) {
    const ListParam = [{ "Name": "lotes", "Type": "VarChar", "Value": lotes }];

    const base = {
      sp: 'SP_IMPRIME_TRANSCAMARA_LOTES',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //impresion matricial
  getImpresionMatricial(numero) {
    const ListParam = [{ "Name": "TRC_NUMSEC", "Type": "NVarChar", "Value": numero.toString() }];

    const base = {
      sp: 'spr_AgregarColaImpresion',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //impresion MULTIPAGINAS
  getImpresionMultiPag(tipo, numero) {

    const ListParam = [{ "Name": "TIPO", "Type": "VarChar", "Value": tipo },
    { "Name": "NUMERO", "Type": "NVarChar", "Value": numero.toString() }];

    const base = {
      sp: 'SP_IMPRIMEMULTPAGINAS',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //impresion pallet
  getImpresionPallet(sscc, tipo) {
    const ListParam = [{ "Name": "sscc", "Type": "VarChar", "Value": sscc },
    { "Name": "ocultatitle", "Type": "VarChar", "Value": tipo }];

    const base = {
      sp: 'SP_IMPRIME_TRANSCAMARA_PALLET',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //Ubicacion
  getUbicacion(planta, bodega, user) {
    const ListParam = [{ "Name": "planta", "Type": "VarChar", "Value": planta },
    { "Name": "bodega", "Type": "VarChar", "Value": bodega },
    { "Name": "user", "Type": "VarChar", "Value": user }];

    const base = {
      sp: 'SP_CARGAUBICACION',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

  //VALIDO UNIFICACION LOTES
  getValidaUnif(tipo, motivo, sscc, bodori, boddes, ref) {
    console.log("UNIFI");
    const ListParam = [{ "Name": "tipo", "Type": "VarChar", "Value": tipo },
    { "Name": "motivo", "Type": "VarChar", "Value": motivo },
    { "Name": "sscc", "Type": "VarChar", "Value": sscc },
    { "Name": "bodori", "Type": "VarChar", "Value": bodori },
    { "Name": "boddes", "Type": "VarChar", "Value": boddes },
    { "Name": "ref", "Type": "VarChar", "Value": ref }];

    const base = {
      sp: 'SP_VALIDA_UNIFCOLA',
      param: ListParam,
      conexion: CONNECTION_PROD
    };

    return this.http.post<ResultWS>(URL_CONSULT, base);
  }

}

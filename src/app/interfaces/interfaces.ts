export interface Componente {
  title: string;
  ionicIcon: string;
  url: string;
}


export interface Saldos {
  BODEGA: string;
  Ubica: string;
  PRODUCTO: string;
  TALLA: string;
  LOTE: string;
  CJS: string;
  MSTRS: string;
}

export interface DataCombos {
  CODIGO: string;
  DESCRIPCION: string;
}

export interface Tables {
  Table: [];
  Table1: [];
  Table2: [];
  Table3: [];
  Table4: [];
  Table5: [];
  Table6: [];
}

export interface ResultWS {
  Codigo: boolean;
  Description: string;
  Dt: Tables;
}



export interface TablaCodigo {
  Codigo: string;
}


export interface ClsProducto {
  id: string;
  producto: string;
  talla: number;
  lote: string;
  saldo: number;
  acumulado: number;
}

export interface tb_DataGrid {
  sscc: string;
  num: number;
  ssccp: string;
  ubic: string;
}

export interface tb_DataGrid2 {
  sscc: string;
  Tipo: string;
}

export interface tb_DataGridTumbada {
  Prod: string,
  Talla: string,
  Lote: string,
  Masters: string,
  Coches: string,
  Valida: string
}



export interface SaldosGlobal{
  CODIGO:string,
  DESCRIPCION:string,
  MASTER:number,
  LIBRAS:number,
}


export interface Valida{
  Codigo: string;
  Description: string;
  Dt: Validatable;
}

export interface Validatable{
  Table: [];
}


export interface DetalleCons {
  Table: [];
}

export interface RWDetalleCons{
  Codigo: string;
  Description: string;
  Dt: Validatable;
}


export interface RWEmbarques{
  Codigo: string;
  Description: string;
  Dt: Validatable;
}


export interface Embarques {
  id: number;
  descrip: string;
}

export interface Tipo {
  CODIGO: number;
  DESCRIPCION: string;
}

export interface Bodega {
  CODIGO: number;
  DESCRIPCION: string;
}

export interface Proceso {
  CODIGO: number;
  DESCRIPCION: string;
}

export interface Trans {
  CODIGO: number;
  DESCRIPCION: string;
}

export interface Cierre {
  id: number;
  descrip: string;
}


export interface DetalleCombos {
  Table: [];
  Table1: [];
  Table2: [];
  Table3: [];
}

export interface RWCombosCons{
  Codigo: string;
  Description: string;
  Dt: DetalleCombos;
}
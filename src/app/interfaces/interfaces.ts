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
  Codigo: string;
  Description: string;
  Dt: Tables;
}

export interface TablaCodigo {
  Codigo: string;
}




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
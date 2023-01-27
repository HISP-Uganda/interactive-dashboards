import Dexie, { Table } from "dexie";
import { DataNode } from "./interfaces";

export interface IOrgUnit {
  id?: string;
  pId: string;
  value: string;
  title: string;
  isLeaf: boolean;
}

export interface IDataElement {
  id: string;
  code: string;
  name: string;
  intervention: string;
  interventionCode: string;
  subKeyResultArea: string;
  subKeyResultAreaCode: string;
  keyResultArea: string;
  keyResultAreaCode: string;
}

export interface IExpanded {
  id: string;
  name: string;
}

export class CQIDexie extends Dexie {
  organisations!: Table<IOrgUnit>;
  themes!: Table<DataNode>;
  expanded!: Table<IExpanded>;
  dataElements!: Table<IDataElement>;

  constructor() {
    super("idvt");
    this.version(1).stores({
      organisations: "++id,value,pId,title",
      themes: "++id,value,pId,title,key",
      expanded: "++id,name",
      dataElements:
        "++id,code,interventionCode,subKeyResultAreaCode,keyResultAreaCode",
    });
  }
}

export const db = new CQIDexie();

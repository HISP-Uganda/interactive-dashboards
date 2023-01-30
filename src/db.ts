import Dexie, { Table } from "dexie";
import { DataNode, IExpanded, IDataElement, Option } from "./interfaces";
export class CQIDexie extends Dexie {
  organisations!: Table<DataNode>;
  themes!: Table<DataNode>;
  expanded!: Table<IExpanded>;
  expandedKeys!: Table<IExpanded>;
  dataElements!: Table<IDataElement>;
  levels!: Table<Option>;
  groups!: Table<Option>;
  dataSets!: Table<Option>;

  constructor() {
    super("idvt");
    this.version(1).stores({
      organisations: "++id,value,pId,title",
      themes: "++id,value,pId,title,key",
      expanded: "++id,name",
      expandedKeys: "++id,name",
      dataElements:
        "++id,code,interventionCode,subKeyResultAreaCode,keyResultAreaCode,theme",
      levels: "++value,label",
      groups: "++value,label",
      dataSets: "++value,label",
    });
  }
}

export const db = new CQIDexie();

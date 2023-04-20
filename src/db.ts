import Dexie, { Table } from "dexie";
import {
    DataNode,
    IExpanded,
    IDataElement,
    Option,
    SystemInfo,
} from "./interfaces";
export class CQIDexie extends Dexie {
    organisations!: Table<DataNode>;
    themes!: Table<DataNode>;
    expanded!: Table<IExpanded>;
    expandedKeys!: Table<IExpanded>;
    dataElements!: Table<IDataElement>;
    levels!: Table<Option>;
    groups!: Table<Option>;
    dataSets!: Table<Option>;
    systemInfo!: Table<SystemInfo>;
    dashboards!: Table<DataNode>;

    constructor() {
        super("idvt");
        this.version(1).stores({
            organisations: "++id,value,pId,title",
            themes: "++id,value,pId,title,key",
            expanded: "++id,name",
            expandedKeys: "++id,name",
            dataElements:
                "++id,code,interventionCode,subKeyResultAreaCode,keyResultAreaCode,themeCode,programCode,degId,degsId",
            levels: "++value,label",
            groups: "++value,label",
            dataSets: "++value,label",
            systemInfo: "++id,systemId,systemName",
            dashboards: "++key,value,pId,title,id",
        });
    }
}

export const db = new CQIDexie();

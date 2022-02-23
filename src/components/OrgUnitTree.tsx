import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import "antd/dist/antd.css";
import { useStore } from "effector-react";
import { flatten } from "lodash";
import { useState } from "react";
import {
  setSelectedUnits,
  setSublevel,
  setSublevels,
} from "../Events";
import { $store } from "../Store";

const query = (parent: any) => {
  return {
    response: {
      resource: "organisationUnits.json",
      params: {
        filter: `id:in:[${parent.id}]`,
        paging: "false",
        order: "shortName:desc",
        fields: "children[id,name,level,path,leaf]",
      },
    },
  };
};
const OrgUnitTree = () => {
  const store = useStore($store);
  const [units, setUnits] = useState<any[]>(store.organisationUnits);
  const engine = useDataEngine();
  const onLoadData = async (parent: any) => {
    try {
      const {
        response: { organisationUnits },
      }: any = await engine.query(query(parent));
      const found = organisationUnits.map((unit: any) => {
        return unit.children
          .map((child: any) => {
            return {
              id: child.id,
              pId: parent.id,
              value: child.id,
              title: child.name,
              isLeaf: child.leaf,
              level: child.level,
            };
          })
          .sort((a: any, b: any) => {
            if (a.title > b.title) {
              return 1;
            }
            if (a.title < b.title) {
              return -1;
            }
            return 0;
          });
      });
      console.log(units)
      setUnits([...units, ...flatten(found)]);
    } catch (e) {
      console.log(e);
    }
  };

  const onOrgUnitChange = async (value: string) => {
    const unitObj = {
      1: 3,
      2: 3,
      3: 4,
      4: 4,
    };
    const zooms = {
      1: 6.0,
      2: 7.5,
      3: 9.0,
      4: 9.0,
    };
    const unit = units.find((u: any) => u.id === value);
    setSelectedUnits(value);
    setSublevel(unit.level + 2);

    const {
      response: { organisationUnits },
    }: any = await engine.query(query(unit));
    const found = organisationUnits.map((unit: any) => {
      return unit.children.sort((a: any, b: any) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    });
    setSublevels(flatten(found));
  };

  return (
    <TreeSelect
      allowClear={true}
      treeDataSimpleMode
      size="large"
      showArrow
      style={{ width: "20%" }}
    //   value={}
      dropdownStyle={{
        maxHeight: 400,
        overflow: "auto",
      }}
      placeholder="Please select health centre"
      onChange={onOrgUnitChange}
      loadData={onLoadData}
      treeData={units}
    />
  );
};

export default OrgUnitTree;

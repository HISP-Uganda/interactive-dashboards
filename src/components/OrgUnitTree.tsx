import { useDataEngine } from "@dhis2/app-runtime";
import "antd/dist/antd.css";
import TreeSelect from "antd/lib/tree-select";
import { flatten, uniqBy } from "lodash";
import { useState } from "react";
import { db } from "../db";

type OrgUnitTreeProps = {
  initial: any[];
  expandedKeys: string[];
  onChange: (value: string) => void;
  value: string;
};

const OrgUnitTree = ({
  initial,
  expandedKeys,
  onChange,
  value,
}: OrgUnitTreeProps) => {
  const engine = useDataEngine();
  const [treeData, setTreeData] = useState<any[]>(initial);
  const [expanded, setExpanded] = useState<React.Key[]>(expandedKeys);
  const onLoadData = async (parent: any) => {
    try {
      const parentChildren = treeData.find((t) => t.pId === parent.id);
      if (parentChildren === undefined) {
        const {
          units: { organisationUnits },
        }: any = await engine.query({
          units: {
            resource: "organisationUnits.json",
            params: {
              filter: `id:in:[${parent.id}]`,
              paging: "false",
              order: "shortName:desc",
              fields: "children[id,name,path,leaf]",
            },
          },
        });
        const found = organisationUnits.map((unit: any) => {
          return unit.children
            .map((child: any) => {
              return {
                id: child.id,
                pId: parent.id,
                value: child.id,
                title: child.name,
                isLeaf: child.leaf,
                _key: child.id,
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
        const all: any[] = uniqBy(
          [
            ...treeData.map((a: any) => {
              return { ...a, _key: a.id };
            }),
            ...flatten(found),
          ],
          "id"
        );
        db.collection("facilities").set(all, {
          keys: true,
        });
        setTreeData(all);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onTreeExpand = (expandedKeys: React.Key[]) => {
    db.collection("expanded").set(
      expandedKeys.map((k) => {
        return {
          value: k,
          _key: k,
        };
      }),
      {
        keys: true,
      }
    );
    setExpanded(() => expandedKeys);
  };
  return (
    <TreeSelect
      allowClear={true}
      treeDataSimpleMode
      style={{ width: "100%" }}
      value={value}
      listHeight={700}
      treeExpandedKeys={expanded}
      onTreeExpand={onTreeExpand}
      dropdownStyle={{ overflow: "auto" }}
      placeholder="Please select location"
      onChange={onChange}
      showSearch={true}
      loadData={onLoadData}
      treeData={treeData}
    />
  );
};

export default OrgUnitTree;

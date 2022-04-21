import { useDataEngine } from "@dhis2/app-runtime";
import { Tree } from "antd";
import "antd/dist/antd.css";
import { useStore } from "effector-react";
import { Event } from "effector";
import { flatten } from "lodash";
import { useState } from "react";
import { DataNode, IData } from "../interfaces";
import { $store } from "../Store";
import { Stack } from "@chakra-ui/react";
import GlobalAndFilter from "./data-sources/GlobalAndFilter";

const createQuery = (parent: any) => {
  return {
    organisations: {
      resource: `organisationUnits.json`,
      params: {
        filter: `id:in:[${parent}]`,
        paging: "false",
        order: "shortName:desc",
        fields: "children[id,name,path,leaf]",
      },
    },
  };
};

type OrgUnitTreeProps = {
  denNum: IData;
  onChange: Event<{ id: string; what: string; type: string; remove?: boolean }>;
};

function updateTreeData(
  list: DataNode[],
  key: React.Key,
  children: DataNode[]
): DataNode[] {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

const OrgUnitTree = ({ denNum, onChange }: OrgUnitTreeProps) => {
  const engine = useDataEngine();
  const store = useStore($store);
  const [treeData, setTreeData] = useState(store.organisationUnits);
  const [dimension, setDimension] = useState<"filter" | "dimension">("filter");
  const [useGlobal, setUseGlobal] = useState<boolean>(false);

  const onCheck = (checkedKeysValue: any, other: any) => {
    checkedKeysValue.checked.forEach((v: string) =>
      onChange({ id: v, type: "filter", what: "ou" })
    );
    if (other.checked === false) {
      onChange({
        id: other.node.key,
        type: "filter",
        what: "ou",
        remove: true,
      });
    }
  };

  const onLoadData = async ({ key, children }: any) => {
    const {
      organisations: { organisationUnits },
    }: any = await engine.query(createQuery(key));
    const found = organisationUnits.map((unit: any) => {
      return unit.children
        .map((child: any) => {
          return {
            key: child.id,
            title: child.name,
            isLeaf: child.leaf,
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
    setTreeData((origin) => updateTreeData(origin, key, flatten(found)));
  };
  return (
    <Stack>
      <GlobalAndFilter
        dimension={dimension}
        setDimension={setDimension}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
      />
      {!useGlobal && (
        <Tree
          checkable
          checkStrictly
          loadData={onLoadData}
          treeData={treeData}
          onCheck={onCheck}
          checkedKeys={Object.entries(denNum.dataDimensions)
            .filter(([k, { what }]) => what === "ou")
            .map(([key]) => key)}
        />
      )}
    </Stack>
  );
};

export default OrgUnitTree;

import { Box, Stack, Text } from "@chakra-ui/react";
import { Tree } from "antd";
// import type { DataNode } from "antd/lib/tree";
import { GroupBase, Select } from "chakra-react-select";
import React, { useState } from "react";

import { useDataEngine } from "@dhis2/app-runtime";
import "antd/dist/antd.css";
import { useStore } from "effector-react";
import { flatMapDeep, isArray, max } from "lodash";
import {
  setCheckedKeys,
  setExpandedKeys,
  setGroups,
  setLevels,
  setMinSublevel,
  setOrganisations,
} from "../Events";
import { DataNode, Option } from "../interfaces";
import { $store } from "../Store";

function traverse(node: any, path: any[] = [], result: any[] = []) {
  if (node && (!node.children || node.children.length === 0)) {
    result.push(path.concat(node.level));
  }
  if (node && node.children && node.children.length > 0) {
    for (const child of node.children) {
      traverse(child, path.concat(node.level), result);
    }
  }
  return result;
}

const getMembers: any = (members: any[]) => {
  let children: any[] = [];
  const flattenMembers = members.map((m) => {
    if (m.children && m.children.length) {
      children = [...children, ...m.children];
    }
    return m;
  });

  return flattenMembers.concat(
    children.length ? getMembers(children) : children
  );
};

const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[]
): DataNode[] =>
  list.map((node) => {
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

const OUTree = ({
  units,
  groups,
  levels,
}: {
  units: DataNode[];
  levels: Option[];
  groups: Option[];
}) => {
  const store = useStore($store);
  const engine = useDataEngine();
  const [treeData, setTreeData] = useState<DataNode[]>(units);
  const [flattened, setFlattened] = useState<any[]>(units);

  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onCheck = (
    checkedKeysValue:
      | { checked: React.Key[]; halfChecked: React.Key[] }
      | React.Key[]
  ) => {
    let checked: React.Key[] = [];
    setCheckedKeys(checkedKeysValue);
    if (isArray(checkedKeysValue)) {
      setOrganisations(checkedKeysValue);
      checked = checkedKeysValue;
    } else {
      setOrganisations(checkedKeysValue.checked);
      checked = checkedKeysValue.checked;
    }
    const filtered = flattened
      .filter(({ key }) => checked.indexOf(key) !== -1)
      .map(({ level }) => Number(level));
    const minSublevel: number | null | undefined = max(filtered);
    if (minSublevel && minSublevel + 1 <= store.maxLevel) {
      setMinSublevel(minSublevel + 1);
    } else {
      setMinSublevel(store.maxLevel);
    }
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    setOrganisations(selectedKeysValue);
    setCheckedKeys({ checked: selectedKeysValue, halfChecked: [] });
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onLoadData = async ({ key, children }: any) => {
    if (children) {
      return;
    }
    try {
      const {
        units: { organisationUnits },
      }: any = await engine.query({
        units: {
          resource: "organisationUnits.json",
          params: {
            filter: `id:in:[${key}]`,
            paging: "false",
            order: "shortName:desc",
            fields: "children[id,name,level,path,leaf]",
          },
        },
      });
      const found = organisationUnits.flatMap((unit: any) => {
        return unit.children
          .map((child: any) => {
            const record: DataNode = {
              key: child.id,
              title: child.name,
              isLeaf: child.leaf,
              level: child.level,
            };
            return record;
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
      setFlattened((prev) => [...prev, ...found]);
      setTreeData((origin) => updateTreeData(origin, key, found));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stack bg="white" spacing="20px">
      <Box border="1px solid gray" h="250px" overflow="auto">
        <Tree
          multiple
          checkable
          treeData={treeData}
          loadData={onLoadData}
          checkStrictly
          onExpand={onExpand}
          expandedKeys={store.expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={store.checkedKeys}
          onSelect={onSelect}
          selectedKeys={store.organisations}
        />
      </Box>
      <Stack>
        <Text>Level</Text>
        <Select<Option, true, GroupBase<Option>>
          isMulti
          options={levels}
          value={levels.filter(
            (d: Option) => store.levels.indexOf(d.value) !== -1
          )}
          onChange={(e) => {
            setLevels(e.map((ex) => ex.value));
          }}
        />
      </Stack>
      <Stack>
        <Text>Group</Text>
        <Select<Option, true, GroupBase<Option>>
          isMulti
          options={groups}
          value={groups.filter(
            (d: Option) => store.groups.indexOf(d.value) !== -1
          )}
          onChange={(e) => {
            setGroups(e.map((ex) => ex.value));
          }}
        />
      </Stack>
    </Stack>
  );
};

export default OUTree;

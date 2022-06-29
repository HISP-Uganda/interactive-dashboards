import { Box, Button, Checkbox, Spacer, Stack, Text } from "@chakra-ui/react";
import { Tree } from "antd";
import type { DataNode } from "antd/lib/tree";
import { GroupBase, Select } from "chakra-react-select";
import React, { useState } from "react";

import { useDataEngine } from "@dhis2/app-runtime";
import "antd/dist/antd.css";
import { isArray } from "lodash";
import { Option } from "../interfaces";

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
  selectedUnits,
  selectedLevels,
  selectedGroups,
  expandedKeys,
  onChange,
}: {
  units: DataNode[];
  levels: Option[];
  groups: Option[];
  selectedUnits: React.Key[];
  selectedLevels: string[];
  selectedGroups: string[];
  expandedKeys: React.Key[];
  onChange: (data: {
    selectedUnits: React.Key[];
    selectedLevels: string[];
    selectedGroups: string[];
    expandedKeys: React.Key[];
  }) => void;
}) => {
  const engine = useDataEngine();
  const [treeData, setTreeData] = useState<DataNode[]>(units);
  const [availableLevels, setAvailableLevels] =
    useState<string[]>(selectedLevels);
  const [availableGroups, setAvailableGroups] =
    useState<string[]>(selectedGroups);
  const [expanded, setExpanded] = useState<React.Key[]>(expandedKeys);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [checkedKeys, setCheckedKeys] = useState<
    { checked: React.Key[]; halfChecked: React.Key[] } | React.Key[]
  >({ checked: selectedUnits, halfChecked: [] });
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedUnits);

  const onCheck = (
    checkedKeysValue:
      | { checked: React.Key[]; halfChecked: React.Key[] }
      | React.Key[]
  ) => {
    setCheckedKeys(checkedKeysValue);
    if (isArray(checkedKeysValue)) {
      setSelectedKeys(checkedKeysValue);
    } else {
      setSelectedKeys(checkedKeysValue.checked);
    }
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    setSelectedKeys(selectedKeysValue);
    setCheckedKeys({ checked: selectedKeysValue, halfChecked: [] });
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpanded(expandedKeysValue);
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
            fields: "children[id,name,path,leaf]",
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
      setTreeData((origin) => updateTreeData(origin, key, found));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stack w="500px" bg="white" p="30px" spacing="10px">
      <Stack
        direction="row"
      >
        <Checkbox>User OrgUnit</Checkbox>
      </Stack>
      <Box border="1px solid gray" h="300px" overflow="auto">
        <Tree
          multiple
          checkable
          treeData={treeData}
          loadData={onLoadData}
          checkStrictly
          onExpand={onExpand}
          expandedKeys={expanded}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
        />
      </Box>
      <Stack direction="row" width="100%" alignItems="center">
        <Text w="50px">Level</Text>
        <Box flex={1}>
          <Select<Option, true, GroupBase<Option>>
            size="sm"
            isMulti
            options={levels}
            value={levels.filter(
              (d: Option) => availableLevels.indexOf(d.value) !== -1
            )}
            onChange={(e) => setAvailableLevels(e.map((ex) => ex.value))}
          />
        </Box>
      </Stack>
      <Stack direction="row" width="100%" alignItems="center">
        <Text w="50px">Group</Text>
        <Box flex={1}>
          <Select<Option, true, GroupBase<Option>>
            size="sm"
            isMulti
            options={groups}
            value={groups.filter(
              (d: Option) => availableGroups.indexOf(d.value) !== -1
            )}
            onChange={(e) => setAvailableGroups(e.map((ex) => ex.value))}
          />
        </Box>
      </Stack>
      <Stack direction="row" mt="10px">
        <Spacer />
        <Button
          onClick={() =>
            onChange({
              selectedUnits: selectedKeys,
              selectedLevels: availableLevels,
              selectedGroups: availableGroups,
              expandedKeys: expanded,
            })
          }
        >
          Update
        </Button>
      </Stack>
    </Stack>
  );
};

export default OUTree;

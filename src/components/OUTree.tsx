import { Stack, Text } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import { GroupBase, Select } from "chakra-react-select";
import { useLiveQuery } from "dexie-react-hooks";
import { useStore } from "effector-react";
import { flatten } from "lodash";
import React from "react";
import { db } from "../db";
import { setGroups, setLevels } from "../Events";
import { DataNode, Option } from "../interfaces";
import { $store } from "../Store";

const OUTree = ({
  groups,
  levels,
  value,
  onChange,
}: {
  units: DataNode[];
  levels: Option[];
  groups: Option[];
  value: string | string[] | undefined;
  onChange: (value: string | string[] | undefined) => void;
}) => {
  const store = useStore($store);
  const engine = useDataEngine();
  const organisations = useLiveQuery(() => db.organisations.toArray());
  const expanded = useLiveQuery(() => db.expanded.toArray());

  const onLoadData = async ({ id, children }: any) => {
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
            filter: `id:in:[${id}]`,
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
              pId: id,
              value: child.id,
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
      await db.organisations.bulkPut(flatten(found));
    } catch (e) {
      console.log(e);
    }
  };
  const onTreeExpand = async (expandedKeys: React.Key[]) => {
    await db.expanded.clear();
    await db.expanded.bulkPut(
      expandedKeys.map((val) => {
        return { id: String(val), name: String(val) };
      })
    );
  };
  return (
    <Stack bgColor="white" spacing="20px">
      <TreeSelect<string | string[] | undefined>
        size="large"
        allowClear={true}
        treeDataSimpleMode
        multiple={true}
        style={{ width: "100%" }}
        value={value}
        listHeight={700}
        dropdownStyle={{ overflow: "auto" }}
        treeExpandedKeys={expanded?.map(({ id }) => id)}
        onTreeExpand={onTreeExpand}
        placeholder="Please select organisation unit"
        onChange={onChange}
        loadData={onLoadData}
        treeData={organisations}
      />
      <Stack zIndex={300}>
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
      <Stack zIndex={200}>
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

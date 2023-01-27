import { Spinner, Stack } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { uniqBy } from "lodash";
import React from "react";
import { db } from "../db";
import { DataNode } from "../interfaces";
import { useTheme } from "../Queries";
import { useStore } from "effector-react";
import { $store } from "../Store";
import { setThemes } from "../Events";

function TreeObject() {
  const treeData = useLiveQuery(() => db.themes.toArray());
  const engine = useDataEngine();
  const store = useStore($store);
  const onLoadData = async ({ key, children }: any) => {
    if (children) {
      return;
    }
    const query = {
      dataElementGroupSets: {
        resource: `dataElementGroupSets.json?filter=attributeValues.attribute.id:eq:MeGs34GOrPw&filter=attributeValues.value:eq:${key}&fields=dataElementGroups[id,name,code,dataElements[id,code,name]],id,code,name,attributeValues[attribute[id,name],value]`,
      },
      keyResultAreaOptionSet: {
        resource: `optionSets/maneCSaltkB.json`,
        params: {
          fields: "options[name,code]",
        },
      },
    };
    const {
      dataElementGroupSets: { dataElementGroupSets },
      keyResultAreaOptionSet: { options },
    }: any = await engine.query(query);
    const keyResultAreas = dataElementGroupSets.flatMap(
      ({ attributeValues, ...rest }: any) => {
        const manifestoAttribute = attributeValues.find(
          (a: any) => a.attribute.id === "utwfmesHJxo"
        );
        if (manifestoAttribute) {
          return { otherInfo: rest, resultArea: manifestoAttribute.value };
        }
      }
    );
    const finalOptions: DataNode[] = options.flatMap(({ code, name }: any) => {
      const search = keyResultAreas.find(
        ({ resultArea }: any) => resultArea === code
      );
      if (search) {
        const {
          otherInfo: { code: code1, name: name1, dataElementGroups },
        } = search;
        const des = dataElementGroups.flatMap(
          ({ name: groupName, code: groupCode, dataElements }: any) => {
            return dataElements.map(
              ({ code: deCode, id, name: deName }: any) => {
                return {
                  id,
                  code: deCode,
                  name: deName,
                  intervention: groupName,
                  interventionCode: groupCode,
                  subKeyResultArea: name1,
                  subKeyResultAreaCode: code1,
                  keyResultArea: name,
                  keyResultAreaCode: code,
                };
              }
            );
          }
        );

        db.dataElements.bulkPut(des);

        return [
          {
            id: code,
            title: name,
            key: code,
            value: code,
            pId: key,
          } as DataNode,
          {
            id: code1,
            title: name1,
            key: code1,
            value: code1,
            pId: code,
          } as DataNode,
          ...dataElementGroups.map(({ code, name }: any) => {
            return {
              id: code,
              title: name,
              key: code,
              value: code,
              pId: code1,
              isLeaf: true,
            };
          }),
        ];
      }
      return [];
    });
    await db.themes.bulkPut(uniqBy(finalOptions, "id"));
  };
  return (
    <TreeSelect
      value={store.themes}
      multiple={true}
      listHeight={700}
      treeDataSimpleMode
      loadData={onLoadData}
      treeData={treeData}
      dropdownStyle={{}}
      size="large"
      onChange={(value) => setThemes(value)}
    />
  );
}

export default function ThemeTree() {
  const { isLoading, isError, isSuccess, error } = useTheme("CpVpEK1vno7");
  return (
    <Stack>
      {isLoading && <Spinner />}
      {isSuccess && <TreeObject />}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
}

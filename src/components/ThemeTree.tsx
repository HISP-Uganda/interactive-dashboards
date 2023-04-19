import { Stack, Text } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { Tree } from "antd";
import arrayToTree from "array-to-tree";
import { useLiveQuery } from "dexie-react-hooks";
import { useStore } from "effector-react";
import { uniqBy } from "lodash";
import React, { useState } from "react";
import { db } from "../db";
import { setDataElements, setThemes } from "../Events";
import { DataNode } from "../interfaces";
import { useTheme } from "../Queries";
import { $store } from "../Store";
import LoadingIndicator from "./LoadingIndicator";

function TreeObject() {
    const treeData = useLiveQuery(() => db.themes.toArray());
    const expanded = useLiveQuery(() => db.expanded.get("1"));
    const engine = useDataEngine();
    const store = useStore($store);
    const [checkedKeys, setCheckedKeys] = useState<
        { checked: React.Key[]; halfChecked: React.Key[] } | React.Key[]
    >([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
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
                    return {
                        otherInfo: rest,
                        resultArea: manifestoAttribute.value,
                    };
                }
            }
        );
        const finalOptions: DataNode[] = options.flatMap(
            ({ code, name }: any) => {
                const search = keyResultAreas.find(
                    ({ resultArea }: any) => resultArea === code
                );
                if (search) {
                    const {
                        otherInfo: {
                            code: code1,
                            name: name1,
                            dataElementGroups,
                        },
                    } = search;
                    const des = dataElementGroups.flatMap(
                        ({
                            name: groupName,
                            code: groupCode,
                            dataElements,
                        }: any) => {
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
                                        theme: key,
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
            }
        );
        await db.themes.bulkPut(uniqBy(finalOptions, "id"));
    };
    const onExpand = async (expandedKeysValue: React.Key[]) => {
        await db.expanded.put({ id: "1", name: expandedKeysValue.join(",") });
        setAutoExpandParent(false);
    };

    const onCheck = async (
        checkedKeysValue:
            | { checked: React.Key[]; halfChecked: React.Key[] }
            | React.Key[]
    ) => {
        let allChecked = [];
        if (Array.isArray(checkedKeysValue)) {
            allChecked = checkedKeysValue;
        } else {
            allChecked = checkedKeysValue.checked;
        }
        const realExpanded = expanded?.name.split(",") || [];
        for (const checkedValue of allChecked) {
            if (
                realExpanded.indexOf(String(checkedValue)) === -1 &&
                String(checkedValue).length === 2
            ) {
                await onLoadData({ key: checkedValue });
                await db.expanded.put({
                    id: "1",
                    name: [...realExpanded, checkedValue].join(","),
                });
            }
        }
        const themes = allChecked.map((v) => String(v));
        setCheckedKeys(checkedKeysValue);
        setThemes(themes);

        const elements = await db.dataElements
            .where("keyResultAreaCode")
            .anyOf(themes)
            .or("theme")
            .anyOf(themes)
            .or("subKeyResultAreaCode")
            .anyOf(themes)
            .or("interventionCode")
            .anyOf(themes)
            .toArray();
        setDataElements(elements);
    };

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log("onSelect", info);
        setSelectedKeys(selectedKeysValue);
    };

    return (
        <Tree
            checkable
            onExpand={onExpand}
            checkStrictly
            expandedKeys={expanded?.name.split(",") || []}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            loadData={onLoadData}
            style={{
                backgroundColor: "#ebf8ff",
                maxHeight: "500px",
                overflow: "auto",
                fontSize: "18px",
            }}
            treeData={
                treeData ? arrayToTree(treeData, { parentProperty: "pId" }) : []
            }
        />
    );
}

export default function ThemeTree() {
    const { isLoading, isError, isSuccess, error } = useTheme("CpVpEK1vno7");
    return (
        <Stack>
            {isLoading && <LoadingIndicator />}
            {isSuccess && <TreeObject />}
            {isError && <Text>No data/Error occurred</Text>}
        </Stack>
    );
}

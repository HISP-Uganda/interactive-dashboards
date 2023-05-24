import { CarryOutOutlined } from "@ant-design/icons";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Tree } from "antd";
import { EventDataNode } from "antd/es/tree";
import arrayToTree from "array-to-tree";
import { useLiveQuery } from "dexie-react-hooks";
import { useStore } from "effector-react";
import { orderBy, uniq, groupBy } from "lodash";
import React, { useState } from "react";
import { db } from "../db";
import {
    setColumns,
    setDataElements,
    setOriginalColumns,
    setRows,
    updateVisualizationData,
    setRealColumns,
    setFixedColumns,
} from "../Events";
import { DataNode, IDataElement, LocationGenerics } from "../interfaces";
import { $store } from "../Store";
import { loadData } from "./helpers";
import { computeFinancialYears } from "../utils/utils";

const labels: { [key: string]: string } = {
    M0ACvr6Coqn: "Commitments",
    dWAaPPBAEbL: "Directives",
    emIWijzLHR4: "Themes",
    iE5A3BBdv2z: "Programmes",
    JmQ4TJUKOKi: "Performance",
};

export default function DashboardTree() {
    const search = useSearch<LocationGenerics>();
    const store = useStore($store);
    const navigate = useNavigate();
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
    const [checkedKeys, setCheckedKeys] = useState<
        { checked: React.Key[]; halfChecked: React.Key[] } | React.Key[]
    >([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(() => [
        store.selectedDashboard,
    ]);
    const treeData = useLiveQuery(() => db.dashboards.toArray());
    const engine = useDataEngine();

    const onSelect = async (
        selectedKeys: React.Key[],
        info: {
            event: "select";
            selected: boolean;
            node: EventDataNode<DataNode>;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        }
    ) => {
        setSelectedKeys(() => selectedKeys);
        if (info.node.pId === "") {
            const children = await loadData(info.node, engine);
            const columns = [
                { id: "a", title: "A", bg: "green" },
                { id: "b", title: "MA", bg: "yellow" },
                { id: "c", title: "NA", bg: "red" },
                { id: "d", title: "X", bg: "" },
            ];

            const firstColumns = [
                {
                    id: "title",
                    title: labels[info.node.key] || "",
                    columnSpan: 1,
                    rowSpan: 2,
                },
                {
                    id: "totalIndicators",
                    title: "Indicators",
                    columnSpan: 1,
                    rowSpan: 2,
                },
            ];

            setFixedColumns(firstColumns);

            const allColumns = computeFinancialYears(2020).flatMap((fy) => {
                return columns.map((c) => {
                    return {
                        ...c,
                        fy: fy.value,
                        bg: c.bg || "",
                        fullId: `${fy.value}${c.id}`,
                    };
                });
            });
            setColumns(allColumns);
            setRealColumns(allColumns);
            setOriginalColumns([
                ...firstColumns,
                ...computeFinancialYears(2020).map(({ value, key }) => {
                    return {
                        id: key,
                        title: value,
                        columnSpan: columns.length,
                        textAlign: "center",
                        rowSpan: 1,
                        fullId: key,
                    };
                }),
            ]);
            const allElements = await db.dataElements.toArray();
            let elements: IDataElement[] = [];

            if (info.node.id === "dWAaPPBAEbL") {
                elements = allElements.filter(({ themeCode }) => !themeCode);
            } else {
                elements = allElements.filter(({ themeCode }) => !!themeCode);
            }

            setRows(
                children.map((c: any) => {
                    const filteredElements = elements.filter((e) => {
                        if (
                            info.node.id === "emIWijzLHR4" ||
                            info.node.key === "JmQ4TJUKOKi"
                        ) {
                            return e.themeCode === c.key;
                        }
                        if (info.node.id === "iE5A3BBdv2z") {
                            return e.programCode === c.key;
                        }

                        if (info.node.id === "M0ACvr6Coqn") {
                            return e.interventionCode === c.key;
                        }

                        return (
                            e.interventionCode === c.key ||
                            e.themeCode === c.key ||
                            e.programCode === c.key
                        );
                    });
                    const groups = groupBy(filteredElements, "degId");
                    const realElements =
                        info.node.key === "JmQ4TJUKOKi"
                            ? Object.keys(groups)
                            : filteredElements.map(({ id }: any) => id);
                    return {
                        ...c,
                        child: false,
                        totalIndicators: realElements.length,
                        elements: realElements,
                        method:
                            info.node.key === "JmQ4TJUKOKi"
                                ? "groups"
                                : "elements",
                        groups,
                    };
                })
            );

            if (info.node.key === "JmQ4TJUKOKi") {
                setColumns([]);
                setOriginalColumns([
                    { id: "title", title: "Themes" },
                    { id: "xx", title: "Commitments" },
                    { id: "achieved", title: "Achieved" },
                    { id: "onTrack", title: "On track to be achieved" },
                    { id: "slow", title: "Actions with slow progress" },
                ]);

                setRealColumns([
                    { id: "achieved", title: "Achieved", fullId: "achieved" },
                    {
                        id: "onTrack",
                        title: "On track to be achieved",
                        fullId: "onTrack",
                    },
                    {
                        id: "slow",
                        title: "Actions with slow progress",
                        fullId: "slow",
                    },
                ]);
            }
            updateVisualizationData({
                visualizationId: "keyResultAreas",
                data: [{ value: uniq(elements.map((e) => e.id)).length }],
            });
            updateVisualizationData({
                visualizationId: "indicators",
                data: [{ value: elements.length }],
            });
            updateVisualizationData({
                visualizationId: "indicators",
                data: [{ value: elements.length }],
            });
            updateVisualizationData({
                visualizationId: "interventions",
                data: [
                    {
                        value: uniq(elements.map((e) => e.interventionCode))
                            .length,
                    },
                ],
            });
            updateVisualizationData({
                visualizationId: "outputs",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "directives",
                data: [{ value: children.length }],
            });
            setDataElements(elements);
            setCheckedKeys({ checked: [], halfChecked: [] });

            navigate({
                to: `/dashboards/${info.node.key}`,
                search,
            });
        }
    };
    const onCheck = async (
        checkedKeysValue:
            | { checked: React.Key[]; halfChecked: React.Key[] }
            | React.Key[],
        info: any
    ) => {
        const { checkedNodes, node } = info;
        const realCheckedNodes: string[] = checkedNodes.flatMap(
            ({ pId, key }: any) => {
                if (pId === node.pId) {
                    return key;
                }
                return [];
            }
        );

        setCheckedKeys({ checked: realCheckedNodes, halfChecked: [] });
        if (realCheckedNodes.length > 0) {
            const elements = await db.dataElements
                .where("themeCode")
                .anyOf(realCheckedNodes)
                .or("programCode")
                .anyOf(realCheckedNodes)
                .or("interventionCode")
                .anyOf(realCheckedNodes)
                .toArray();
            setDataElements(elements);

            let columns = [
                { id: "Px8Lqkxy2si", title: "Target" },
                { id: "HKtncMjp06U", title: "Actual" },
            ];

            let firstColumns = [];

            if (node.pId === "dWAaPPBAEbL") {
                firstColumns = [
                    { id: "interventionCode", title: "Directives", w: "125px" },
                    // { id: "program", title: "Programme" },
                    {
                        id: "name",
                        title: "Indicators",
                        w: "500px",
                        columnSpan: 1,
                        rowSpan: 2,
                    },
                ];
            } else if (node.pId === "p2racpd5cNU") {
                firstColumns = [
                    {
                        id: "name",
                        title: "Commitments",
                        w: "600px",
                        columnSpan: 1,
                        rowSpan: 2,
                    },
                ];
            } else {
                firstColumns = [
                    {
                        id: "name",
                        title: "Indicator",
                        w: "600px",
                        columnSpan: 1,
                        rowSpan: 2,
                    },
                ];
            }

            setFixedColumns(firstColumns);

            const allColumns = computeFinancialYears(2020).flatMap((fy) => {
                return columns.map((c) => {
                    return {
                        ...c,
                        fullId: `${fy.value}${c.id}`,
                        fy: fy.value,
                    };
                });
            });
            setRows(
                elements.map((e) => {
                    return { ...e, child: true };
                })
            );
            setColumns(allColumns);
            setRealColumns(allColumns);
            setOriginalColumns([
                ...firstColumns,
                ...computeFinancialYears(2020).map(({ value, key }) => {
                    return {
                        id: key,
                        title: value,
                        columnSpan: columns.length,
                        textAlign: "center",
                        rowSpan: 1,
                    };
                }),
            ]);
            updateVisualizationData({
                visualizationId: "keyResultAreas",
                data: [
                    {
                        value: uniq(elements.map((e) => e.keyResultAreaCode))
                            .length,
                    },
                ],
            });
            updateVisualizationData({
                visualizationId: "indicators",
                data: [{ value: elements.length }],
            });
            updateVisualizationData({
                visualizationId: "interventions",
                data: [
                    {
                        value: uniq(elements.map((e) => e.interventionCode))
                            .length,
                    },
                ],
            });
            updateVisualizationData({
                visualizationId: "outputs",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "directives",
                data: [{ value: realCheckedNodes.length }],
            });
            navigate({
                to: `/dashboards/${node.pId}`,
                search,
            });
        } else {
            setRows([]);
            updateVisualizationData({
                visualizationId: "indicators",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "a",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "b",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "c",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "directives",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "aa",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "aav",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "av",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "bav",
                data: [{ value: 0 }],
            });
            updateVisualizationData({
                visualizationId: "na",
                data: [{ value: 0 }],
            });
        }
    };
    return (
        <Tree
            checkable
            checkStrictly
            showLine
            icon={<CarryOutOutlined />}
            onSelect={onSelect}
            loadData={(treeNode: EventDataNode<DataNode>) =>
                loadData(treeNode, engine)
            }
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            selectedKeys={selectedKeys}
            style={{
                backgroundColor: "#F7FAFC",
                maxHeight: "800px",
                overflow: "auto",
                //   fontSize: "18px",
            }}
            treeData={
                treeData
                    ? arrayToTree(orderBy(treeData, "sortOrder"), {
                          parentProperty: "pId",
                      })
                    : []
            }
        />
    );
}

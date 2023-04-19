import { CarryOutOutlined } from "@ant-design/icons";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Tree } from "antd";
import { EventDataNode } from "antd/es/tree";
import arrayToTree from "array-to-tree";
import { useLiveQuery } from "dexie-react-hooks";
import { useStore } from "effector-react";
import { uniq } from "lodash";
import React, { useState } from "react";
import { db } from "../../db";
import {
    setColumns,
    setDataElements,
    setOriginalColumns,
    setRows,
    updateVisualizationData,
} from "../../Events";
import { DataNode, IDataElement, LocationGenerics } from "../../interfaces";
import { $store } from "../../Store";
import { loadData } from "../helpers";

const labels: { [key: string]: string } = {
    M0ACvr6Coqn: "Commitments",
    dWAaPPBAEbL: "Directives",
    emIWijzLHR4: "Themes",
    iE5A3BBdv2z: "Programmes",
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
            setOriginalColumns([
                { id: "title", title: labels[info.node.key] || "" },
                { id: "totalIndicators", title: "Indicators" },
            ]);
            setColumns([
                { id: "a", title: "A", bg: "green" },
                { id: "b", title: "MA", bg: "yellow" },
                { id: "c", title: "NA", bg: "red" },
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
                        if (info.node.id === "emIWijzLHR4") {
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
                    return {
                        ...c,
                        child: false,
                        totalIndicators: filteredElements.length,
                        elements: filteredElements.map(({ id }) => id),
                    };
                })
            );
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

            if (node.pId === "dWAaPPBAEbL") {
                setOriginalColumns([
                    { id: "interventionCode", title: "Directives", w: "125px" },
                    // { id: "program", title: "Programme" },
                    { id: "name", title: "Indicators", w: "500px" },
                ]);
            } else {
                setOriginalColumns([
                    { id: "name", title: "Indicator", w: "600px" },
                ]);
            }
            setRows(
                elements.map((e) => {
                    return { ...e, child: true };
                })
            );
            setColumns([
                { id: "Px8Lqkxy2si", title: "Target" },
                { id: "HKtncMjp06U", title: "Actual" },
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
                treeData ? arrayToTree(treeData, { parentProperty: "pId" }) : []
            }
        />
    );
}

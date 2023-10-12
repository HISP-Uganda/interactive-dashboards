import { CarryOutOutlined } from "@ant-design/icons";
import { Stack } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Tree } from "antd";
import { EventDataNode } from "antd/es/tree";
import arrayToTree from "array-to-tree";
import { useStore } from "effector-react";
import React from "react";
import { useElementSize } from "usehooks-ts";
import {
    DataNode,
    IDashboard,
    LocationGenerics,
    IVisualization,
} from "../../interfaces";
import { useDashboards, useFilterResources } from "../../Queries";
import { $settings, $store, $path } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import { storeApi } from "../../Events";
import { orderBy } from "lodash";
import { AutoFontSizeDiv } from "../AutoFontSizeDiv";

function DashboardItem({
    dashboards,
    visualization,
}: {
    dashboards: IDashboard[];
    visualization: IVisualization;
}) {
    const navigate = useNavigate<LocationGenerics>();
    const search = useSearch<LocationGenerics>();
    const [squareRef, { width, height }] = useElementSize();
    const store = useStore($store);
    const settings = useStore($settings);
    const path = useStore($path);
    const bg = visualization.properties["layout.bg"] || "";
    const sort = visualization.properties["sort"] || false;
    const descending = visualization.properties["descending"] || false;

    const { data, isError, isLoading, isSuccess, error } =
        useFilterResources(dashboards);
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
        storeApi.setSelectedKeys(selectedKeys);
        let current = "./";
        if (settings.template) {
            current = path;
        }
        if (info.node.pId === "") {
            const { optionSet, affected, ...rest } = search;
            navigate({
                to: `${current}${info.node.key}`,
                search: { ...rest },
            });
        } else if (info.node.actual) {
            navigate({
                to: `${current}${info.node.actual}`,
                search: (old) => ({
                    ...old,
                    affected: info.node.nodeSource?.search,
                    optionSet: info.node.value,
                }),
            });
        } else {
            navigate({
                to: `${current}${info.node.pId}`,
                search: (old) => ({
                    ...old,
                    affected: info.node.nodeSource?.search,
                    optionSet: info.node.value,
                }),
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
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }
    if (isSuccess && data) {
        return (
            <Stack
                ref={squareRef}
                w="100%"
                h="100%"
                flex={1}
                bg={bg}
                overflow="auto"
            >
                <Tree
                    checkable
                    checkStrictly
                    showLine
                    icon={<CarryOutOutlined />}
                    onSelect={onSelect}
                    selectedKeys={store.selectedKeys}
                    expandedKeys={store.expandedKeys}
                    onExpand={(e) => storeApi.setExpandedKeys(e)}
                    autoExpandParent={false}
                    onCheck={onCheck}
                    style={{
                        height: `${height}px`,
                        overflow: "auto",
                    }}
                    treeData={
                        sort
                            ? orderBy(
                                  arrayToTree(data, { parentProperty: "pId" }),
                                  "order",
                                  [descending ? "desc" : "asc"]
                              )
                            : arrayToTree(data, { parentProperty: "pId" })
                    }
                />
            </Stack>
        );
    }
    return <pre>{JSON.stringify(error)}</pre>;
}

export default function DashboardList({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        storage,
        store.systemId
    );

    if (isLoading) {
        return <LoadingIndicator />;
    }
    if (isSuccess && data) {
        return (
            <DashboardItem
                dashboards={data.filter(
                    ({ excludeFromList }) => !excludeFromList
                )}
                visualization={visualization}
            />
        );
    }
    return <pre>{JSON.stringify(error)}</pre>;
}

import { CarryOutOutlined } from "@ant-design/icons";
import { Stack } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Tree } from "antd";
import { EventDataNode } from "antd/es/tree";
import arrayToTree from "array-to-tree";
import { useStore } from "effector-react";
import React from "react";
import { useElementSize } from "usehooks-ts";
import { DataNode, IDashboard, LocationGenerics } from "../../interfaces";
import { useDashboards, useFilterResources } from "../../Queries";
import { $settings, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";

function DashboardItem({ dashboards }: { dashboards: IDashboard[] }) {
    const navigate = useNavigate<LocationGenerics>();
    const search = useSearch<LocationGenerics>();
    const [squareRef, { width, height }] = useElementSize();

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
        if (info.node.pId === "") {
            const { optionSet, affected, ...rest } = search;
            navigate({
                to: `/dashboards/${info.node.key}`,
                search: { ...rest },
            });
        } else if (info.node.actual) {
            navigate({
                to: `/dashboards/${info.node.actual}`,
                search: (old) => ({
                    ...old,
                    affected: info.node.nodeSource.search,
                    optionSet: info.node.value,
                }),
            });
        } else {
            navigate({
                search: (old) => ({
                    ...old,
                    affected: info.node.nodeSource.search,
                    optionSet: info.node.value,
                }),
                replace: true,
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
            <Stack ref={squareRef} w="100%">
                <Tree
                    checkable
                    checkStrictly
                    showLine
                    icon={<CarryOutOutlined />}
                    onSelect={onSelect}
                    autoExpandParent={false}
                    onCheck={onCheck}
                    style={{
                        height: `${height}px`,
                        overflow: "auto",
                        // fontSize: "24px",
                    }}
                    treeData={arrayToTree(data, { parentProperty: "pId" })}
                />
            </Stack>
        );
    }
    return <pre>{JSON.stringify(error)}</pre>;
}

export default function DashboardList() {
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
            />
        );
    }
    return <pre>{JSON.stringify(error)}</pre>;
}

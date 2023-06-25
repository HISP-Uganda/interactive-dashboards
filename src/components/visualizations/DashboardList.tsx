import { CarryOutOutlined } from "@ant-design/icons";
import { Spinner, Text } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Tree } from "antd";
import { EventDataNode } from "antd/es/tree";
import arrayToTree from "array-to-tree";
import { useStore } from "effector-react";
import React from "react";
import { DataNode, IDashboard, LocationGenerics } from "../../interfaces";
import { useDashboards, useFilterResources } from "../../Queries";
import { $dashboard, $settings, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";

function DashboardItem({ dashboards }: { dashboards: IDashboard[] }) {
    const navigate = useNavigate<LocationGenerics>();
    const search = useSearch<LocationGenerics>();
    const dashboard = useStore($dashboard);

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

    return (
        <>
            {isLoading && <Spinner />}
            {isSuccess && data && (
                <Tree
                    // checkable
                    // checkStrictly
                    showLine
                    icon={<CarryOutOutlined />}
                    onSelect={onSelect}
                    autoExpandParent={true}
                    // onCheck={onCheck}
                    // checkedKeys={checkedKeys}
                    // selectedKeys={selectedKeys}
                    expandedKeys={[dashboard.id]}
                    style={{
                        // backgroundColor: "#F7FAFC",
                        maxHeight: "800px",
                        overflow: "auto",
                        fontSize: "18px",
                    }}
                    treeData={arrayToTree(data, { parentProperty: "pId" })}
                />
            )}
            {isError && <pre>{JSON.stringify(error)}</pre>}
        </>
    );
}

export default function DashboardList() {
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        storage,
        store.systemId
    );
    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && <DashboardItem dashboards={data} />}
            {isError && <pre>{JSON.stringify(error)}</pre>}
        </>
    );
}

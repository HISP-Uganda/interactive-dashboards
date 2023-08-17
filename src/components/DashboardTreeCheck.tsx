import { Text } from "@chakra-ui/react";
import { Tree } from "antd";
import { useStore } from "effector-react";
import React, { useState } from "react";
import { DataNode, IDashboard, ISection, IVisualization } from "../interfaces";
import { useDashboards } from "../Queries";
import { $settings, $store } from "../Store";
import LoadingIndicator from "./LoadingIndicator";

function RealTree({
    dashboards,
    onChange,
    value,
}: {
    dashboards: IDashboard[];
    onChange: (data: any) => void;
    value: any;
}) {
    const [checkedKeys, setCheckedKeys] = useState<
        { checked: React.Key[]; halfChecked: React.Key[] } | React.Key[]
    >(value.map((x: any) => x.key));
    const processed = dashboards.map((dashboard) => {
        const dashboardChildren = dashboard.sections.map((section) => {
            const sectionNode: DataNode = {
                pId: dashboard.id,
                type: "section",
                nodeSource: section,
                key: section.id,
                title: section.title || section.id,
                value: section.id,
            };
            const visualizations = section.visualizations.map(
                (visualization) => {
                    const visualizationNode: DataNode = {
                        pId: section.id,
                        type: "visualization",
                        nodeSource: visualization,
                        key: visualization.id,
                        title: visualization.name || visualization.id,
                        value: visualization.id,
                        parent: sectionNode,
                    };
                    return visualizationNode;
                }
            );

            return { ...sectionNode, children: visualizations };
        });
        const node: DataNode = {
            pId: "",
            type: "dashboard",
            nodeSource: dashboard,
            key: dashboard.id,
            title: dashboard.name,
            value: dashboard.id,
            children: dashboardChildren,
        };
        return node;
    });

    const onCheck = async (
        checkedKeysValue:
            | { checked: React.Key[]; halfChecked: React.Key[] }
            | React.Key[],
        info: any
    ) => {
        setCheckedKeys(checkedKeysValue);
        onChange(
            info?.checkedNodes.map(({ children, ...rest }: any) => ({
                ...rest,
            }))
        );
    };
    return (
        <Tree
            checkable
            multiple
            checkStrictly
            showLine
            selectable={false}
            // icon={<CarryOutOutlined />}
            // onSelect={onSelect}

            // autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            // selectedKeys={selectedKeys}
            style={{
                maxHeight: "800px",
                overflow: "auto",
                fontSize: "16px",
            }}
            treeData={processed}
        />
    );
}
export default function DashboardTreeCheck({
    value,
    onChange,
}: {
    value: any;
    onChange: (e: string) => void;
}) {
    const store = useStore($store);
    const { storage } = useStore($settings);

    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        storage,
        store.systemId
    );

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && (
                <RealTree dashboards={data} onChange={onChange} value={value} />
            )}
            {isError && <Text>{error?.message}</Text>}
        </>
    );
}

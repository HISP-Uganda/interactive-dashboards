import React from "react";
import { Tree } from "antd";
import { IDashboard, DataNode, LocationGenerics } from "../interfaces";
import { EventDataNode } from "antd/es/tree";
import { useSearch, useNavigate } from "@tanstack/react-location";

type DashboardTreeProps = {
  dashboards: IDashboard[];
};

export default function DashboardTree({ dashboards }: DashboardTreeProps) {
  const search = useSearch<LocationGenerics>();
  const navigate = useNavigate();

  const tree: DataNode[] = dashboards.map((d) => {
    const node: DataNode = {
      isLeaf: false,
      pId: "",
      key: d.id,
      // style: { background: "yellow" },
      children: [
        {
          isLeaf: true,
          pId: d.id,
          key: d.id + "child",
          children: [],
          title: d.name || "children",
        },
      ],
      title: d.name || "",
      checkable: false,
    };

    return node;
  });

  const onSelect = (
    selectedKeys: React.Key[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode<DataNode>;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => {
    if (!info.node.isLeaf) {
      navigate({
        to: `/dashboards/${info.node.key}`,
        search,
      });
    }
  };
  return (
    <Tree
      checkable
      checkStrictly
      onSelect={onSelect}
      style={{
        backgroundColor: "#ebf8ff",
        maxHeight: "500px",
        overflow: "auto",
        fontSize: "18px",
      }}
      treeData={tree}
    />
  );
}

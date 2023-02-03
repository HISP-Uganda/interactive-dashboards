import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Tree } from "antd";
import {
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { EventDataNode } from "antd/es/tree";
import arrayToTree from "array-to-tree";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { db } from "../db";
import { DataNode, LocationGenerics } from "../interfaces";
import {
  setDataElements,
  updateVisualizationData,
  setRows,
  setOriginalColumns,
  setColumns,
} from "../Events";
import { uniq } from "lodash";

export default function DashboardTree() {
  const search = useSearch<LocationGenerics>();
  const navigate = useNavigate();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<
    { checked: React.Key[]; halfChecked: React.Key[] } | React.Key[]
  >([]);
  const treeData = useLiveQuery(() => db.dashboards.toArray());
  const engine = useDataEngine();

  const loadData = async (node: EventDataNode<DataNode>) => {
    if (node.children) {
      return node.children;
    }
    if (node.nodeSource) {
      const query = {
        data: {
          resource: node.nodeSource.resource,
          params: node.nodeSource.fields
            ? { fields: node.nodeSource.fields }
            : {},
        },
      };
      const { data }: any = await engine.query(query);

      const options = data.options.map((o: any) => {
        const calculated: DataNode = {
          isLeaf: true,
          pId: String(node.key),
          key: o.code,
          style: { margin: "5px" },
          id: o.code,
          value: o.code,
          title: o.name,
          checkable: true,
          hasChildren: false,
          selectable: false,
        };
        return calculated;
      });
      await db.dashboards.bulkPut(options);
      return options;
    }
    return [];
  };

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
      const children = await loadData(info.node);
      setOriginalColumns([
        { id: "title", title: "Indicator" },
        { id: "totalIndicators", title: "# Indicators" },
      ]);
      setColumns([
        { id: "a", title: "A" },
        { id: "b", title: "MA" },
        { id: "c", title: "NA" },
      ]);

      const elements = await db.dataElements.toArray();

      setRows(
        children.map((c: any) => {
          const filteredElements = elements.filter(
            (e) =>
              e.interventionCode === c.key ||
              e.themeCode === c.key ||
              e.programCode === c.key
          );
          return { ...c, totalIndicators: filteredElements.length };
        })
      );
      updateVisualizationData({
        visualizationId: "keyResultAreas",
        data: [
          { value: uniq(elements.map((e) => e.keyResultAreaCode)).length },
        ],
      });
      updateVisualizationData({
        visualizationId: "indicators",
        data: [{ value: elements.length }],
      });
      updateVisualizationData({
        visualizationId: "interventions",
        data: [{ value: uniq(elements.map((e) => e.interventionCode)).length }],
      });
      updateVisualizationData({
        visualizationId: "outputs",
        data: [{ value: 0 }],
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
    const realCheckedNodes = checkedNodes.flatMap(({ pId, key }: any) => {
      if (pId === node.pId) {
        return key;
      }
      return [];
    });
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
      updateVisualizationData({
        visualizationId: "keyResultAreas",
        data: [
          { value: uniq(elements.map((e) => e.keyResultAreaCode)).length },
        ],
      });
      updateVisualizationData({
        visualizationId: "indicators",
        data: [{ value: elements.length }],
      });
      updateVisualizationData({
        visualizationId: "interventions",
        data: [{ value: uniq(elements.map((e) => e.interventionCode)).length }],
      });
      updateVisualizationData({
        visualizationId: "outputs",
        data: [{ value: 0 }],
      });
      navigate({
        to: `/dashboards/${node.pId}`,
        search,
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
      loadData={loadData}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      style={{
        backgroundColor: "#F7FAFC",
        maxHeight: "800px",
        overflow: "auto",
        fontSize: "18px",
      }}
      treeData={
        treeData ? arrayToTree(treeData, { parentProperty: "pId" }) : []
      }
    />
  );
}

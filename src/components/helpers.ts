import { EventDataNode } from "antd/es/tree";
import { db } from "../db";
import { DataNode } from "../interfaces";

export const loadData = async (node: EventDataNode<DataNode>, engine: any) => {
    if (node.children) {
        return node.children;
    }
    if (node.nodeSource && node.nodeSource.resource) {
        const query: any = {
            data: {
                resource: node.nodeSource.resource,
                params: node.nodeSource.fields
                    ? { fields: node.nodeSource.fields }
                    : {},
            },
        };
        const { data }: any = await engine.query(query);

        if (data.dataElementGroupSets) {
            data.options = data.dataElementGroupSets.flatMap(
                ({ dataElementGroups, id, name, code }: any) => {
                    if (dataElementGroups) {
                        return dataElementGroups;
                    } else if (id) {
                        return { id, name, code };
                    }
                }
            );
        } else if (data.dataElements) {
            data.options = data.dataElements;
        } else if (data.dataElementGroups) {
            data.options = data.dataElementGroups;
        }
        const options = data.options.map((o: any) => {
            const calculated: DataNode = {
                isLeaf: true,
                pId: String(node.key),
                key: o.code,
                id: o.id || o.code,
                value: o.code,
                title: o.name,
                checkable: true,
                hasChildren: false,
                selectable: false,
                nodeSource: {},
            };
            return calculated;
        });
        await db.dashboards.bulkPut(options);
        return options;
    }
    return [];
};

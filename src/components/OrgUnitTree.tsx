import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { flatten } from "lodash";
import { db } from "../db";

type OrgUnitTreeProps = {
    initial: any[];
    expandedKeys: string[];
    onChange: (value: string) => void;
    value: string;
};

const OrgUnitTree = ({ onChange, value }: OrgUnitTreeProps) => {
    const engine = useDataEngine();
    const expanded = useLiveQuery(() => db.expanded.toArray());
    const organisations = useLiveQuery(() => db.organisations.toArray());

    const onLoadData = async ({ children, key }: any) => {
        try {
            if (children) {
                return;
            }
            const {
                units: { organisationUnits },
            }: any = await engine.query({
                units: {
                    resource: "organisationUnits.json",
                    params: {
                        filter: `id:in:[${key}]`,
                        paging: "false",
                        order: "shortName:desc",
                        fields: "children[id,name,path,leaf]",
                    },
                },
            });
            const found = organisationUnits.map((unit: any) => {
                return unit.children
                    .map((child: any) => {
                        return {
                            id: child.id,
                            pId: key,
                            value: child.id,
                            title: child.name,
                            isLeaf: child.leaf,
                            key: child.id,
                        };
                    })
                    .sort((a: any, b: any) => {
                        if (a.title > b.title) {
                            return 1;
                        }
                        if (a.title < b.title) {
                            return -1;
                        }
                        return 0;
                    });
            });
            await db.organisations.bulkPut(flatten(found));
        } catch (e) {
            console.log(e);
        }
    };
    const onTreeExpand = async (expandedKeys: React.Key[]) => {
        await db.expanded.clear();
        await db.expanded.bulkPut(
            expandedKeys.map((val) => {
                return { id: String(val), name: String(val) };
            })
        );
    };
    return (
        <TreeSelect
            allowClear={true}
            treeDataSimpleMode
            style={{ width: "100%" }}
            value={value}
            listHeight={700}
            treeExpandedKeys={expanded?.map(({ id }) => id)}
            onTreeExpand={onTreeExpand}
            dropdownStyle={{ overflow: "auto" }}
            placeholder="Please select location"
            onChange={onChange}
            showSearch={true}
            loadData={onLoadData}
            treeData={organisations}
        />
    );
};

export default OrgUnitTree;

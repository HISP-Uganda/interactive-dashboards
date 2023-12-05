import { Stack } from "@chakra-ui/react";
import { ConfigProvider, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { flatten, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { useElementSize } from "usehooks-ts";
import { ChartProps, Column, Threshold } from "../../interfaces";
import { columnTree } from "../../utils/components";
import { SPECIAL_COLUMNS } from "../constants";
import { processTable } from "../processors";

const Tables = ({ visualization, data, dimensions, others }: ChartProps) => {
    const [squareRef, { height, width }] = useElementSize();
    const flattenedData = flatten(data);
    const rows = String(visualization.properties?.["rows"] ?? "").split(",");
    const columns = String(visualization.properties?.["columns"] ?? "").split(
        ","
    );

    const thresholds: Threshold[] =
        visualization.properties?.["data.thresholds"] ?? [];
    const aggregation = visualization.properties?.["aggregation"] ?? "count";
    const aggregationColumn =
        visualization.properties?.["aggregationColumn"] ?? "";

    const [initial, setInitial] = useState<{
        finalColumns: Column[][];
        finalRows: Column[][];
        finalData: any[];
    }>(
        processTable(
            flattenedData,
            rows,
            columns.filter((c) => SPECIAL_COLUMNS.indexOf(c) === -1),
            columns.filter((c) => SPECIAL_COLUMNS.indexOf(c) !== -1),
            aggregation,
            thresholds,
            aggregationColumn,
            dimensions,
            visualization.properties
        )
    );
    const real: Array<ColumnsType<any>> = columns.map((a) => {
        return uniq(data.map((d: any) => d[a]))
            .filter((d: any) => !!d)
            .map((d) => {
                return {
                    title:
                        visualization.properties[`${String(d)}.name`] ||
                        String(d),
                    dataIndex: String(d),
                    key: String(d),
                };
            });
    });

    const [available, setAvailable] = useState<ColumnsType<any>>([]);

    useEffect(() => {
        setInitial(() =>
            processTable(
                flattenedData,
                rows,
                columns.filter((c) => SPECIAL_COLUMNS.indexOf(c) === -1),
                columns.filter((c) => SPECIAL_COLUMNS.indexOf(c) !== -1),
                aggregation,
                thresholds,
                aggregationColumn,
                dimensions,
                visualization.properties
            )
        );
        const allColumns = columnTree(real, visualization.properties);
        const othersColumns: ColumnsType<any> = rows.map((d, index) => {
            return {
                title: visualization.properties[`${d}.name`] || d,
                key: String(d),
                // ellipsis: true,
                fixed: "left",
                // width: "400px",
                render: (text, data) => {
                    const value = data[String(d)];
                    return visualization.properties[`${value}.name`] || value;
                },
                onCell: (data, index) => {
                    const value = data[String(d)];
                    const obj: any = {
                        flex: 1,
                    };
                    if (index !== undefined) {
                        if (
                            index >= 1 &&
                            initial.finalData[index - 1] &&
                            value === initial.finalData[index - 1][d]
                        ) {
                            obj.rowSpan = 0;
                        } else {
                            for (
                                let i = 0;
                                index + i !== initial.finalData.length &&
                                initial.finalData[index + i] &&
                                value === initial.finalData[index + i][d];
                                i += 1
                            ) {
                                obj.rowSpan = i + 1;
                            }
                        }
                    }
                    return obj;
                },
            };
        });
        const specialColumns: ColumnsType<any> = columns
            .filter((c) => SPECIAL_COLUMNS.indexOf(c) !== -1)
            .map((c) => ({
                title: visualization.properties[`${c}.name`] || c,
                dataIndex: String(c),
                key: c,
                // ellipsis: true,
                fixed: "left",
                width: "auto",
                align: "center",
                render: (text, data) => data[String(c)],
            }));
        setAvailable(() => [
            ...othersColumns,
            ...specialColumns,
            ...allColumns[0],
        ]);
    }, [JSON.stringify(visualization.properties)]);

    return (
        <Stack
            w="100%"
            bg="white"
            p="0"
            m="0"
            spacing="0"
            h="100%"
            overflow="auto"
            ref={squareRef}
        >
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 0,
                    },
                    components: {
                        Table: {},
                    },
                }}
            >
                <Table
                    size="small"
                    columns={available}
                    dataSource={initial.finalData}
                    bordered
                    pagination={false}
                    rowKey="key"
                    sticky
                />
            </ConfigProvider>
        </Stack>
    );
};

export default Tables;

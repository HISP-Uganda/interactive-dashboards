import {
    Stack,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { flatten, isEmpty, uniqBy } from "lodash";
import React from "react";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData, $visualizationDimensions } from "../../Store";
import { createOptions, createOptions2 } from "../../utils/utils";
import ColorRangePicker from "../ColorRangePicker";
import { SPECIAL_COLUMNS } from "../constants";
import { getLast, getNData } from "../processors";
import Scrollable from "../Scrollable";
import SimpleAccordion from "../SimpleAccordion";
import ColorProperty from "./ColorProperty";
import NumberProperty from "./NumberProperty";
import SelectProperty from "./SelectProperty";
import SwitchProperty from "./SwitchProperty";
import TextProperty from "./TextProperty";

const aggregations = createOptions2(
    [
        "Count",
        "Count unique values",
        "List unique values",
        "Sum",
        "Integer sum",
        "Average",
        "Median",
        "Sample variance",
        "Sample standard deviation",
        "Minimum",
        "Maximum",
        "First",
        "Last",
        "Sum over sum",
        "80% Upper bound",
        "80% Lower bound",
        "sum as a fraction of totals",
        "sum as a fraction of rows",
        "sum as a fraction of columns",
        "Count as a fraction of totals",
        "Count as a fraction of rows",
        "Count as a fraction of columns",
    ],
    [
        "count",
        "countUniqValues",
        "listUniqueValues",
        "sum",
        "integerSum",
        "average",
        "median",
        "sampleVariance",
        "sampleStandardDeviation",
        "minimum",
        "maximum",
        "first",
        "last",
        "sumOverSum",
        "upperBound80",
        "lowerBound80",
        "sumFractionTotals",
        "sumFractionRows",
        "sumFractionColumns",
        "countFractionTotals",
        "countFractionRows",
        "countFractionColumns",
    ]
);

const TableProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    const data = useStore($visualizationData)[visualization.id] || [];
    const dimensions = useStore($visualizationDimensions)[visualization.id];
    const rows = String(visualization.properties["rows"] || "")
        .split(",")
        .filter((x) => !!x);
    const columns1 = String(visualization.properties["columns"] || "")
        .split(",")
        .filter((x) => !!x);

    let normalColumns: string[] = [];

    if (!isEmpty(dimensions)) {
        normalColumns = [...Object.keys(dimensions), "value"];
    }

    const columns = uniqBy(
        createOptions([...normalColumns, ...SPECIAL_COLUMNS]),
        "value"
    );

    const { lastRow, lastColumn } = getLast(flatten(data), rows, columns1);

    const actualData = flatten(data);

    const selectedColumns =
        String(visualization.properties["columns"])
            .split(",")
            .filter((x) => !!x) || [];
    const selectedRows =
        String(visualization.properties["rows"])
            .split(",")
            .filter((x) => !!x) || [];

    return (
        <Stack>
            <SimpleAccordion title="Columns">
                <Stack>
                    <Text>Columns</Text>
                    <Select<Option, true, GroupBase<Option>>
                        value={columns.filter(
                            (pt) => selectedColumns.indexOf(pt.value) !== -1
                        )}
                        onChange={(e) =>
                            sectionApi.changeVisualizationProperties({
                                visualization: visualization.id,
                                attribute: "columns",
                                value: Array.from(e)
                                    .map(({ value }) => value)
                                    .join(","),
                            })
                        }
                        options={columns}
                        isClearable
                        menuPlacement="top"
                        isMulti
                    />
                </Stack>

                <Tabs>
                    <TabList>
                        {selectedColumns.map((col) => (
                            <Tab key={col}>{col}</Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        {selectedColumns.map((col, index) => (
                            <TabPanel key={col}>
                                <Scrollable height={350}>
                                    <Tabs orientation="vertical">
                                        <TabList>
                                            {getNData(
                                                actualData,
                                                selectedColumns,
                                                index
                                            ).map((r) => (
                                                <Tab key={r}>{r}</Tab>
                                            ))}
                                        </TabList>

                                        <TabPanels>
                                            {getNData(
                                                actualData,
                                                selectedColumns,
                                                index
                                            ).map((col) => (
                                                <TabPanel key={col}>
                                                    <Stack>
                                                        <NumberProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Width"
                                                            attribute={`${col}.width`}
                                                            min={50}
                                                            max={500}
                                                            step={1}
                                                        />
                                                        <ColorProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Background"
                                                            attribute={`${col}.bg`}
                                                        />
                                                        <TextProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Rename"
                                                            attribute={`${col}.name`}
                                                        />
                                                        <TextProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Order"
                                                            attribute={`${col}.position`}
                                                        />
                                                    </Stack>
                                                </TabPanel>
                                            ))}
                                        </TabPanels>
                                    </Tabs>
                                </Scrollable>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            </SimpleAccordion>

            <SimpleAccordion title="Rows">
                <Stack>
                    <Text>Rows</Text>
                    <Select<Option, true, GroupBase<Option>>
                        value={columns.filter(
                            (pt) => selectedRows.indexOf(pt.value) !== -1
                        )}
                        onChange={(e) =>
                            sectionApi.changeVisualizationProperties({
                                visualization: visualization.id,
                                attribute: "rows",
                                value: Array.from(e)
                                    .map(({ value }) => value)
                                    .join(","),
                            })
                        }
                        options={columns}
                        isClearable
                        menuPlacement="top"
                        isMulti
                    />
                </Stack>

                <Tabs>
                    <TabList>
                        {selectedRows.map((row) => (
                            <Tab key={row}>{row}</Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        {selectedRows.map((row, index) => (
                            <TabPanel key={row}>
                                <Scrollable height={350}>
                                    <Tabs orientation="vertical">
                                        <TabList>
                                            {getNData(
                                                actualData,
                                                selectedRows,
                                                index
                                            ).map((r) => (
                                                <Tab key={r}>{r}</Tab>
                                            ))}
                                        </TabList>

                                        <TabPanels>
                                            {getNData(
                                                actualData,
                                                selectedRows,
                                                index
                                            ).map((row1) => (
                                                <TabPanel key={row1}>
                                                    <Stack>
                                                        <NumberProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Width"
                                                            attribute={`${row1}.width`}
                                                            min={50}
                                                            max={500}
                                                            step={1}
                                                        />
                                                        <ColorProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Background"
                                                            attribute={`${row1}.bg`}
                                                        />
                                                        <TextProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Rename"
                                                            attribute={`${row1}.name`}
                                                        />
                                                        <TextProperty
                                                            visualization={
                                                                visualization
                                                            }
                                                            title="Order"
                                                            attribute={`${row1}.position`}
                                                        />
                                                    </Stack>
                                                </TabPanel>
                                            ))}
                                        </TabPanels>
                                    </Tabs>
                                </Scrollable>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>

                {/* <Scrollable height={350}>
                    <Tabs orientation="vertical">
                        <TabList>
                            {lastRow.map((r) => (
                                <Tab key={r}>{r}</Tab>
                            ))}
                        </TabList>

                        <TabPanels>
                            {lastRow.map((row, index) => (
                                <TabPanel key={row}>
                                    <Stack>
                                        <NumberProperty
                                            visualization={visualization}
                                            title="Width"
                                            attribute={`${row}.width`}
                                            min={50}
                                            max={500}
                                            step={1}
                                        />
                                        <ColorProperty
                                            visualization={visualization}
                                            title="Background"
                                            attribute={`${row}.bg`}
                                        />
                                        <TextProperty
                                            visualization={visualization}
                                            title="Rename"
                                            attribute={`${row}.name`}
                                        />
                                        <TextProperty
                                            visualization={visualization}
                                            title=""
                                            attribute={`${row}.position`}
                                        />
                                    </Stack>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </Scrollable> */}
            </SimpleAccordion>

            <SimpleAccordion title="Aggregation">
                <SelectProperty
                    visualization={visualization}
                    title="Aggregation"
                    attribute="aggregation"
                    options={aggregations}
                />
                <SelectProperty
                    visualization={visualization}
                    title="Aggregation Column"
                    attribute="aggregationColumn"
                    options={createOptions(normalColumns)}
                />
            </SimpleAccordion>
            <SimpleAccordion title="Table">
                <TextProperty
                    visualization={visualization}
                    title="Table Caption"
                    attribute="TableCaption"
                />
                <TextProperty
                    visualization={visualization}
                    title="Rename Row Header"
                    attribute="rowName"
                />
                <SwitchProperty
                    visualization={visualization}
                    title="Show headers"
                    attribute="showHeaders"
                />
                <SelectProperty
                    visualization={visualization}
                    title="Cell height"
                    attribute="cellHeight"
                    options={createOptions2(
                        ["Small", "Medium", "Large"],
                        ["sm", "md", "lg"]
                    )}
                />
                <SwitchProperty
                    visualization={visualization}
                    title="Enable pagination"
                    attribute="enablePagination"
                />
                <NumberProperty
                    visualization={visualization}
                    title="Minimum column width"
                    attribute="columnMinWidth"
                    min={50}
                    max={1000}
                    step={1}
                />
                <SelectProperty
                    visualization={visualization}
                    title="Column alignment"
                    attribute="columnAlignment"
                    options={createOptions(["auto", "left", "center", "right"])}
                />
            </SimpleAccordion>
            <SimpleAccordion title="Table footer">
                <div></div>
            </SimpleAccordion>
            <SimpleAccordion title="Cell options">
                <SelectProperty
                    visualization={visualization}
                    title="Cell Type"
                    attribute="cellType"
                    options={createOptions2(
                        ["Auto", "Colored text", "Colored background"],
                        ["auto", "coloredText", "coloredBackground"]
                    )}
                />
            </SimpleAccordion>
            <SimpleAccordion title="Threshold">
                <ColorRangePicker visualization={visualization} />
            </SimpleAccordion>
            <SimpleAccordion title="Other options">
                <div></div>
            </SimpleAccordion>
        </Stack>
    );
};

export default TableProperties;

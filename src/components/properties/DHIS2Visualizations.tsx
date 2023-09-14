import { Text } from "@chakra-ui/react";
import React from "react";
import { GroupBase, Select, AsyncSelect } from "chakra-react-select";
import { IDataSource, IVisualization, Option } from "../../interfaces";
import { useDHIS2Visualizations } from "../../Queries";
import { createAxios } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import SelectProperty from "./SelectProperty";
import { sectionApi } from "../../Events";

export default function DHIS2Visualizations({
    dataSource,
    visualization,
}: {
    dataSource: IDataSource;
    visualization: IVisualization;
}) {
    const api = createAxios(dataSource.authentication);
    const { isLoading, data, error, isError, isSuccess } =
        useDHIS2Visualizations(dataSource.isCurrentDHIS2, api);

    if (isError) {
        return <Text>{error?.message}</Text>;
    }
    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (isSuccess && data) {
        return (
            // <AsyncSelect
            //     name="colors"
            //     placeholder="Select some colors..."
            //     loadOptions={(inputValue, callback) => {
            //         setTimeout(() => {
            //             const values = colourOptions.filter((i) =>
            //                 i.label
            //                     .toLowerCase()
            //                     .includes(inputValue.toLowerCase())
            //             );
            //             callback(values);
            //         }, 3000);
            //     }}
            // />
            <SelectProperty
                attribute="visualization"
                visualization={visualization}
                title="DHIS2 Visualization"
                options={data.map((d) => {
                    const o: Option = {
                        label: d.name || "",
                        value: d.id,
                        id: d.type,
                    };
                    return o;
                })}
            />
        );
    }
    return null;
}

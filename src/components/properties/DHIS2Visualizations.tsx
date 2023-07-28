import { Text } from "@chakra-ui/react";
import React from "react";
import { IDataSource, IVisualization, Option } from "../../interfaces";
import { useDHIS2Visualizations } from "../../Queries";
import { createAxios } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import SelectProperty from "./SelectProperty";

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
            <SelectProperty
                attribute="visualization"
                visualization={visualization}
                title="DHIS2 Visualization"
                options={data.map((d) => {
                    const o: Option = {
                        label: d.name || "",
                        value: d.id,
                    };
                    return o;
                })}
            />
        );
    }
    return null;
}

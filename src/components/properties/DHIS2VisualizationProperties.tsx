import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { IDataSource, IVisualization } from "../../interfaces";
import { useDataSources } from "../../Queries";
import { $settings, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import DHIS2Visualizations from "./DHIS2Visualizations";

const DashboardItems = ({
    dataSource,
    visualization,
}: {
    dataSource: IDataSource;
    visualization: IVisualization;
}) => {
    return (
        <DHIS2Visualizations
            dataSource={dataSource}
            visualization={visualization}
        />
    );
};
export default function DHIS2VisualizationProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const { storage } = useStore($settings);
    const { systemId } = useStore($store);
    const { isLoading, isError, isSuccess, data, error } = useDataSources(
        storage,
        systemId
    );

    if (isError) return <Text>{error?.message}</Text>;
    if (isLoading) return <LoadingIndicator />;
    if (isSuccess && data)
        return (
            <Stack>
                {data
                    .filter((d) => d.type === "DHIS2" && d.isCurrentDHIS2)
                    .map((ds) => (
                        <DashboardItems
                            key={ds.id}
                            dataSource={ds}
                            visualization={visualization}
                        />
                    ))}
            </Stack>
        );
    return null;
}

import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import React from "react";
import { datumAPi } from "../../Events";
import { Option } from "../../interfaces";
import { useDHIS2Visualizations } from "../../Queries";
import {
    $currentDataSource,
    $hasDHIS2,
    $visualizationQuery,
} from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import { Text } from "@chakra-ui/react";

export default function DHIS2Visualizations() {
    const currentDataSource = useStore($currentDataSource);
    const hasDHIS2 = useStore($hasDHIS2);
    const visualizationQuery = useStore($visualizationQuery);

    const { isLoading, data, error, isError, isSuccess } =
        useDHIS2Visualizations(hasDHIS2, currentDataSource);

    if (isError) {
        return <Text>{error?.message}</Text>;
    }
    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (isSuccess && data) {
        return (
            <Select<Option, false, GroupBase<Option>>
                value={data
                    .map((d) => {
                        const o: Option = {
                            label: d.name || "",
                            value: d.id,
                        };
                        return o;
                    })
                    .find(
                        (pt) =>
                            Object.keys(
                                visualizationQuery.dataDimensions || {}
                            ).indexOf(pt.value) !== -1
                    )}
                onChange={(e) => {
                    datumAPi.changeDimension({
                        id: e?.value || "",
                        type: "dimension",
                        resource: "v",
                        dimension: "",
                        replace: true,
                    });
                }}
                options={data.map((d) => {
                    const o: Option = {
                        label: d.name || "",
                        value: d.id,
                    };
                    return o;
                })}
                isClearable
            />
        );
    }
    return null;
}

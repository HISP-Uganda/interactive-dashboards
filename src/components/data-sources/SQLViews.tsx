import { Box, Progress, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { datumAPi } from "../../Events";
import { MetadataAPI, Option } from "../../interfaces";
import { useSQLViews } from "../../Queries";
import { $visualizationQuery } from "../../Store";

const SQLViews = ({ api, isCurrentDHIS2 }: MetadataAPI) => {
    const visualizationQuery = useStore($visualizationQuery);
    const { isLoading, isSuccess, isError, error, data } = useSQLViews(
        isCurrentDHIS2,
        api
    );
    return (
        <>
            {isLoading && <Progress />}
            {isSuccess && data && (
                <Stack>
                    <Text>SQL View</Text>
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
                            const sqlView = data.find(
                                ({ id }) => id === e?.value
                            );
                            datumAPi.changeDimension({
                                id: e?.value || "",
                                type: "dimension",
                                resource: "v",
                                dimension: "",
                                replace: true,
                            });
                            datumAPi.changeAttribute({
                                attribute: "query",
                                value: sqlView?.sqlQuery,
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
                </Stack>
            )}
            {isError && <Box>{error?.message}</Box>}
        </>
    );
};

export default SQLViews;

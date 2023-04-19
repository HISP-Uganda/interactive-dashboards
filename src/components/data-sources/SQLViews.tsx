import { Box, Progress, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { IndicatorProps, Option } from "../../interfaces";
import { useSQLViews } from "../../Queries";
import { $currentDataSource, $hasDHIS2 } from "../../Store";

const SQLViews = ({ denNum, onChange, changeQuery }: IndicatorProps) => {
    const hasDHIS2 = useStore($hasDHIS2);
    const currentDataSource = useStore($currentDataSource);
    const { isLoading, isSuccess, isError, error, data } = useSQLViews(
        hasDHIS2,
        currentDataSource
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
                                    label: d.name,
                                    value: d.id,
                                };
                                return o;
                            })
                            .find(
                                (pt) =>
                                    Object.keys(
                                        denNum?.dataDimensions || {}
                                    ).indexOf(pt.value) !== -1
                            )}
                        onChange={(e) => {
                            onChange({
                                id: e?.value || "",
                                type: "dimension",
                                resource: "v",
                                dimension: "",
                                replace: true,
                            });
                            if (changeQuery) {
                                changeQuery({
                                    attribute: "query",
                                    value: data.find(
                                        (d: any) => d.id === e?.value
                                    )?.sqlQuery,
                                });
                            }
                        }}
                        options={data.map((d) => {
                            const o: Option = {
                                label: d.name,
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

import { Progress, Stack } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import React from "react";
import { INamed, MetadataAPI } from "../../interfaces";
import { useDHIS2CategoryCombos } from "../../Queries";

export default function CategoryComboFilter({
    api,
    isCurrentDHIS2,
    value,
    onChange,
}: MetadataAPI & {
    value: string | undefined;
    onChange: (val: string | undefined) => void;
}) {
    const { isLoading, isSuccess, isError, error, data } =
        useDHIS2CategoryCombos(isCurrentDHIS2, api);

    if (isError) return <pre>{JSON.stringify(error)}</pre>;

    if (isLoading) return <Progress />;

    if (isSuccess && data)
        return (
            <Stack>
                <Select<INamed, false, GroupBase<INamed>>
                    options={data}
                    getOptionLabel={(d) => d.name ?? ""}
                    getOptionValue={(d) => d.id}
                    value={data.find((a) => a.id === value)}
                    onChange={(e) => onChange(e?.id)}
                />
            </Stack>
        );

    return null;
}

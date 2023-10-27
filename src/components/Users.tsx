import { Text, Stack } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import React from "react";
import { UserGroup } from "../interfaces";
import { useUsers } from "../Queries";
import LoadingIndicator from "./LoadingIndicator";
export default function Users({
    value,
    onChange,
}: {
    value: UserGroup[];
    onChange: (e: UserGroup[]) => void;
}) {
    const { isLoading, isSuccess, isError, error, data } = useUsers();

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && (
                <Stack>
                    <Text>User Groups</Text>
                    <Select<UserGroup, true, GroupBase<UserGroup>>
                        isMulti
                        options={data}
                        getOptionValue={(v) => v.id}
                        getOptionLabel={(v) => v.displayName}
                        value={data.filter(
                            (d) =>
                                value?.find((u) => u.id === d.id) !== undefined
                        )}
                        onChange={(e) => onChange(e.map((x) => x))}
                        isClearable
                        menuPlacement="top"
                        size="sm"
                    />
                </Stack>
            )}
            {isError && <Text>{error?.message}</Text>}
        </>
    );
}

import { Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import React from "react";
import { IDashboard } from "../interfaces";
import { useDashboards } from "../Queries";
import { $settings, $store } from "../Store";
import LoadingIndicator from "./LoadingIndicator";
export default function DashboardDropDown({
    value,
    onChange,
}: {
    value: string;
    onChange: (e: string) => void;
}) {
    const store = useStore($store);
    const { storage } = useStore($settings);

    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        storage,
        store.systemId
    );

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && (
                <Select<IDashboard, false, GroupBase<IDashboard>>
                    options={data}
                    getOptionValue={(v) => v.id}
                    getOptionLabel={(v) => v.name || ""}
                    value={data.find((d: IDashboard) => d.id === value)}
                    onChange={(e) => onChange(e?.id || "")}
                />
            )}
            {isError && <Text>No data/Error occurred</Text>}
        </>
    );
}

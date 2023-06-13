import { useStore } from "effector-react";
import React from "react";
import { INamed } from "../interfaces";
import { useNamespace } from "../Queries";
import { $settings, $store } from "../Store";
import DataSelect from "./DataSelect";
import LoadingIndicator from "./LoadingIndicator";

export default function NamespaceDropdown<T extends INamed>({
    namespace,
    value,
    onChange,
}: {
    namespace: string;
    onChange: (value: T | null) => void;
    value: T | undefined | null;
}) {
    const { storage } = useStore($settings);
    const { systemId } = useStore($store);

    const { isLoading, isSuccess, error, data } = useNamespace<T>(
        namespace,
        storage,
        systemId,
        []
    );

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (isSuccess && data) {
        return (
            <DataSelect<T>
                list={data}
                labelKey="name"
                valueKey="id"
                value={value}
                onChange={onChange}
            />
        );
    }
    return <pre>{JSON.stringify(error)}</pre>;
}

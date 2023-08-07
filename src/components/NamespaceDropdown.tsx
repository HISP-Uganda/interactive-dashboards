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
    callback,
}: {
    namespace: string;
    onChange: (value: T | null) => void;
    value: string | undefined | null;
    callback?: (value: T[]) => void;
}) {
    const { storage } = useStore($settings);
    const { systemId } = useStore($store);

    const { isLoading, isSuccess, error, isError, data } = useNamespace<T>(
        namespace,
        storage,
        systemId,
        [],
        callback
    );
    if (isError) return <pre>{error?.message}</pre>;

    if (isLoading) return <LoadingIndicator />;

    if (isSuccess && data)
        return (
            <DataSelect<T>
                list={data}
                labelKey="name"
                valueKey="id"
                value={value}
                onChange={onChange}
            />
        );
    return null;
}

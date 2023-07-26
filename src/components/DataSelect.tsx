import React from "react";

import { GroupBase, Select } from "chakra-react-select";

export default function DataSelect<T>({
    list,
    labelKey,
    valueKey,
    value,
    onChange,
}: {
    list: T[];
    labelKey: keyof T;
    valueKey: keyof T;
    value: string | undefined | null;
    onChange: (value: T | null) => void;
}) {
    const currentValue = list.find((l) => String(l[valueKey]) === value);
    return (
        <Select<T, false, GroupBase<T>>
            value={currentValue}
            options={list}
            isClearable
            getOptionLabel={(option: T) => String(option[labelKey])}
            getOptionValue={(option: T) => String(option[valueKey])}
            onChange={(e) => onChange(e)}
        />
    );
}

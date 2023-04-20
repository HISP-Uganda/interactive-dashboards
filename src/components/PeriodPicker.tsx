import { PeriodDimension } from "@dhis2/analytics";
import React from "react";
import { Item, PickerProps } from "../interfaces";

const PeriodPicker = ({ selectedPeriods, onChange }: PickerProps) => {
    const [availablePeriods, setAvailablePeriods] =
        React.useState<Item[]>(selectedPeriods);
    return (
        <PeriodDimension
            onSelect={({
                items,
            }: {
                items: { id: string; name: string }[];
            }) => {
                setAvailablePeriods(items);
                onChange(items);
            }}
            selectedPeriods={availablePeriods}
        />
    );
};

export default PeriodPicker;

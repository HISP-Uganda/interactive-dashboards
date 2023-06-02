import React from "react";
import { DatePicker, Space } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

export default function DateRangePicker() {
    const onChange = (
        value: DatePickerProps["value"] | RangePickerProps["value"],
        dateString: [string, string] | string
    ) => {
        console.log("Selected Time: ", value);
        console.log("Formatted Selected Time: ", dateString);
    };

    const onOk = (
        value: DatePickerProps["value"] | RangePickerProps["value"]
    ) => {
        console.log("onOk: ", value);
    };
    return (
        <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
        />
    );
}

import { Box, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select, SingleValue } from "chakra-react-select";
import { useState } from "react";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";
import { RangeValue } from "rc-picker/lib/interface";

import { Option } from "../interfaces";
import { useStore } from "effector-react";
import { $store } from "../Store";
import { onChangeFixedPeriod, onChangeRelativeTime } from "../Events";
type FixedType = "time" | "date" | "week" | "month" | "quarter" | "year";
const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const periodTypes: Option[] = [
  { value: "fixed", label: "Fixed" },
  { value: "relative", label: "Relative" },
];

const relativePeriods: Option[] = [
  { value: "TODAY", label: "today" },
  { value: "LAST_14_DAYS", label: "Last 14 Days" },
  { value: "THIS_WEEK", label: "This Week" },
  { value: "LAST_WEEK", label: "Last Week" },
  { value: "LAST_4_WEEKS", label: "Last 4 Weeks" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "LAST_3_MONTHS", label: "Last 3 Months" },
  { value: "LAST_6_MONTHS", label: "Last 6 Months" },
  { value: "LAST_12_MONTHS", label: "Last 12 Months" },
  { value: "MONTHS_THIS_YEAR", label: "Months This Year" },
  { value: "THIS_QUARTER", label: "This Quarter" },
  { value: "LAST_QUARTER", label: "Last Quarter" },
  { value: "LAST_4_QUARTERS", label: "Last 4 Quarters" },
  { value: "QUARTERS_THIS_YEAR", label: "Quarters This Year" },
  { value: "THIS_YEAR", label: "This Year" },
  { value: "LAST_YEAR:", label: "Last Year" },
  { value: "LAST_3_YEARS", label: "Last 3 Years" },
  { value: "LAST_5_YEARS", label: "Last 5 Years" },
];

const fixedTypes: Option[] = [
  { value: "time", label: "Time" },
  { value: "date", label: "Date" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

function PickerWithType({
  type,
  onChange,
}: {
  type: FixedType;
  onChange: (values: RangeValue<moment.Moment>) => void;
}) {
  const store = useStore($store);
  if (type === "time")
    return (
      <TimeRangePicker
        style={{ flex: 1 }}
        onChange={onChange}
        value={store.fixedPeriod}
      />
    );
  if (type === "date")
    return (
      <DateRangePicker
        style={{ flex: 1 }}
        onChange={onChange}
        value={store.fixedPeriod}
      />
    );
  return (
    <DateRangePicker
      style={{ flex: 1 }}
      picker={type}
      onChange={onChange}
      value={store.fixedPeriod}
    />
  );
}

const PeriodPicker = () => {
  const store = useStore($store);
  const [periodType, setPeriodType] = useState<Option>({
    value: "fixed",
    label: "Fixed",
  });
  const [fixedPeriodType, setFixedPeriodType] = useState<Option>({
    value: "month",
    label: "Month",
  });

  const onFixedPeriodChange = (values: RangeValue<moment.Moment>) => {
    onChangeFixedPeriod({ periodType, value: values });
  };
  const onRelativePeriodChange = (value: SingleValue<Option>) => {
    if (value) {
      onChangeRelativeTime({ periodType, value });
    }
  };
  return (
    <Stack direction="row" spacing="10px">
      <Stack
        direction="row"
        w="220px"
        justifyItems="center"
        alignItems="center"
      >
        <Text>Period Type</Text>
        <Box flex={1}>
          <Select<Option, false, GroupBase<Option>>
            value={periodType}
            size="sm"
            onChange={(e) =>
              setPeriodType({
                value: e?.value || "",
                label: e?.label || "",
              })
            }
            options={periodTypes}
          />
        </Box>
      </Stack>
      {periodType.value === "relative" && (
        <Stack
          direction="row"
          w="250px"
          justifyItems="center"
          alignItems="center"
        >
          <Text>Period</Text>
          <Box flex={1}>
            <Select<Option, false, GroupBase<Option>>
              size="sm"
              options={relativePeriods}
              value={store.relativePeriod}
              onChange={(value: SingleValue<Option>) =>
                onRelativePeriodChange(value)
              }
            />
          </Box>
        </Stack>
      )}
      {periodType.value === "fixed" && (
        <Stack
          direction="row"
          w="400px"
          justifyItems="center"
          alignItems="center"
        >
          <Text>Period</Text>
          <Stack direction="row" flex={1}>
            <Box w="110px">
              <Select<Option, false, GroupBase<Option>>
                size="sm"
                value={fixedPeriodType}
                onChange={(e) =>
                  setFixedPeriodType({
                    value: e?.value || "",
                    label: e?.label || "",
                  })
                }
                options={fixedTypes}
              />
            </Box>
            <PickerWithType
              type={fixedPeriodType.value as FixedType}
              onChange={(value) => onFixedPeriodChange(value)}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default PeriodPicker;

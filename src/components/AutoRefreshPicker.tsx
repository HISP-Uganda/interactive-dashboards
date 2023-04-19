import { Box, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { setRefreshInterval } from "../Events";
import { Option } from "../interfaces";
import { $dashboard } from "../Store";

const periodTypes: Option[] = [
    { value: "off", label: "Off" },
    { value: "5", label: "5s" },
    { value: "10", label: "10s" },
    { value: "30", label: "30s" },
    { value: "60", label: "1m" },
    { value: "300", label: "5m" },
    { value: "900", label: "15m" },
    { value: "1800", label: "30m" },
    { value: "3600", label: "1h" },
    { value: "7200", label: "2h" },
];

const AutoRefreshPicker = () => {
    const dashboard = useStore($dashboard);
    return (
        <Stack>
            <Text>Auto Refresh Interval</Text>
            <Box w="110px">
                <Select<Option, false, GroupBase<Option>>
                    placeholder="Refresh"
                    value={periodTypes.find(
                        (pt) => pt.value === dashboard.refreshInterval
                    )}
                    onChange={(e) => setRefreshInterval(e?.value || "off")}
                    options={periodTypes}
                />
            </Box>
        </Stack>
    );
};

export default AutoRefreshPicker;

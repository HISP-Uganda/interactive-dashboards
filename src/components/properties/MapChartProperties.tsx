import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { sectionApi } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { createOptions } from "../../utils/utils";
import ColorRangePicker from "../ColorRangePicker";

const mapStyleOptions = createOptions([
    "carto-darkmatter",
    "carto-positron",
    "open-street-map",
    "stamen-terrain",
    "stamen-toner",
    "stamen-watercolor",
    "white-bg",
]);

const MapChartProperties = ({
    visualization,
}: {
    visualization: IVisualization;
}) => {
    return (
        <Stack>
            <ColorRangePicker visualization={visualization} />
            <Text>Map Style</Text>
            <Select<Option, false, GroupBase<Option>>
                value={mapStyleOptions.find(
                    (pt) =>
                        pt.value ===
                        visualization.properties?.["layout.mapbox.style"]
                )}
                onChange={(e) =>
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.mapbox.style",
                        value: e?.value,
                    })
                }
                options={mapStyleOptions}
                isClearable
            />
        </Stack>
    );
};

export default MapChartProperties;

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
import { changeVisualizationProperties } from "../../Events";
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
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.mapbox.style",
                        value: e?.value,
                    })
                }
                options={mapStyleOptions}
                isClearable
            />
            <Text>Zoom</Text>

            <NumberInput
                value={visualization.properties?.["layout.zoom"] || 5.3}
                step={0.1}
                max={20}
                min={5.3}
                onChange={(value1: string, value2: number) =>
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "layout.zoom",
                        value: value2,
                    })
                }
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </Stack>
    );
};

export default MapChartProperties;

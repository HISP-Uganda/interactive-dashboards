import { useRef } from "react";
import { Stack, Text, useDimensions } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChartProps, Threshold } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $globalFilters, $indicators, $store } from "../../Store";
import MapVisualization from "./MapVisualization";
import VisualizationTitle from "./VisualizationTitle";
import LoadingIndicator from "../LoadingIndicator";

const MapChartLeaflet = ({
    visualization,
    dataProperties,
    section,
    data,
}: ChartProps) => {
    const elementRef = useRef<any>();
    const dimensions = useDimensions(elementRef);

    const indicators = useStore($indicators);
    const indicator = indicators.find((v) => v.id === visualization.indicator);
    const { levels, ous } = findLevelsAndOus(indicator);
    const levelIsGlobal = levels.findIndex((l) => l === "GQhi6pRnTKF");
    const ouIsGlobal = ous.findIndex((l) => l === "mclvD0Z9mfT");
    const globalFilters = useStore($globalFilters);
    const thresholds: Threshold[] = dataProperties?.["data.thresholds"] || [
        { id: "1", min: "0", max: "5000", color: "red" },
        { id: "2", min: "5001", max: "10000", color: "yellow" },
        { id: "3", min: "10001", color: "green" },
    ];
    const store = useStore($store);
    const {
        isLoading,
        isError,
        isSuccess,
        error,
        data: metadata,
    } = useMaps(
        levelIsGlobal !== -1 || levels.length === 0 ? store.levels : levels,
        ouIsGlobal !== -1 ? store.organisations.map((k) => String(k)) : ous,
        data,
        thresholds,
        [
            visualization.id,
            ...Object.keys(globalFilters).flatMap((v) => {
                return v;
            }),
        ]
    );

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && (
                <Stack w="100%" h="100%" spacing="0" flex={1}>
                    {visualization.name && (
                        <VisualizationTitle
                            section={section}
                            title={visualization.name}
                        />
                    )}
                    <Stack h="100%" w="100%" flex={1} spacing="0">
                        <Stack
                            flex={1}
                            h="100%"
                            w="100%"
                            spacing="0"
                            ref={elementRef}
                        >
                            <MapVisualization
                                metadata={metadata}
                                data={data}
                                id={visualization.id}
                                otherParams={{
                                    thresholds,
                                    levels:
                                        levelIsGlobal !== -1 ||
                                        levels.length === 0
                                            ? store.levels
                                            : levels,
                                }}
                                height={dimensions?.borderBox.height}
                                width={dimensions?.borderBox.width}
                            />
                        </Stack>
                        <Stack h="20px" direction="row" spacing="0">
                            {thresholds.map((item) => (
                                <Text
                                    key={item.id}
                                    backgroundColor={item.color}
                                    flex={1}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                    fontWeight="bolder"
                                    height="100%"
                                >
                                    {item.max && item.min
                                        ? `${item.min} - ${item.max}`
                                        : item.min
                                        ? `${item.min}+`
                                        : item.max}
                                </Text>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            )}
            {isError && <Text>{error?.message}</Text>}
        </>
    );
};

export default MapChartLeaflet;

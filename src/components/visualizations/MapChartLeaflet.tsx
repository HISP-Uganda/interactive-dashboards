import { Stack, Text, useDimensions } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useRef } from "react";
import { ChartProps, Threshold, IVisualization2 } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $globalFilters, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import MapVisualization from "./MapVisualization";
import VisualizationTitle from "./VisualizationTitle";
import { invertHex } from "../processors";
import { orderBy } from "lodash";

const MapChartLeaflet = ({
    visualization,
    dataProperties,
    section,
    data,
    vizDetails,
}: ChartProps & { vizDetails?: IVisualization2 }) => {
    const elementRef = useRef<any>();
    const dimensions = useDimensions(elementRef);
    const indicator = vizDetails?.indicators[0];
    const { levels, ous } = findLevelsAndOus(indicator);
    const levelIsGlobal = levels.findIndex((l) => l === "GQhi6pRnTKF");
    const ouIsGlobal = ous.findIndex((l) => l === "mclvD0Z9mfT");
    const globalFilters = useStore($globalFilters);
    const thresholds: Threshold[] = dataProperties?.["data.thresholds"] || [
        { id: "1", min: "0", max: "5", color: "red" },
        { id: "2", min: "50", max: "75", color: "yellow" },
        { id: "3", min: "76", color: "green" },
    ];
    const store = useStore($store);
    const {
        isLoading,
        isError,
        isSuccess,
        error,
        data: metadata,
    } = useMaps({
        visualization,
        vizDetails,
        levels:
            levelIsGlobal !== -1 || levels.length === 0 ? store.levels : levels,
        parents:
            ouIsGlobal !== -1 ? store.organisations.map((k) => String(k)) : ous,
        data,
        thresholds,
        otherKeys: [
            visualization.id,
            ...Object.keys(globalFilters).flatMap((v) => {
                return v;
            }),
        ],
    });

    const withoutBaseline = orderBy(
        thresholds.flatMap((val) => {
            if (val.id !== "baseline") {
                return val;
            }
            return [];
        }),
        ["value"],
        ["asc"]
    );

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <Text>{error?.message}</Text>;
    if (isSuccess)
        return (
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
                                    levelIsGlobal !== -1 || levels.length === 0
                                        ? store.levels
                                        : levels,
                            }}
                            height={dimensions?.borderBox.height}
                            width={dimensions?.borderBox.width}
                        />
                    </Stack>
                    <Stack h="20px" direction="row" spacing="0">
                        {thresholds.find(({ id }) => id === "baseline")?.color}
                        <Text
                            key="baseline"
                            backgroundColor={
                                thresholds.find(({ id }) => id === "baseline")
                                    ?.color
                            }
                            flex={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color={invertHex(
                                thresholds.find(({ id }) => id === "baseline")
                                    ?.color || "",
                                true
                            )}
                            fontWeight="bolder"
                            height="100%"
                        >
                            Baseline
                        </Text>
                        {withoutBaseline.map((item, index) => (
                            <Text
                                key={item.id}
                                backgroundColor={item.color}
                                flex={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color={invertHex(item.color, true)}
                                fontWeight="bolder"
                                height="100%"
                            >
                                {index < withoutBaseline.length - 1
                                    ? `${item.value} - ${
                                          withoutBaseline[index + 1].value
                                      }`
                                    : `${item.value}+`}
                            </Text>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        );
    return null;
};

export default MapChartLeaflet;

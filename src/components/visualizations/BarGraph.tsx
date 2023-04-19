import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import isEmpty from "lodash/isEmpty";
import update from "lodash/update";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { $visualizationMetadata } from "../../Store";
import { exclusions } from "../../utils/utils";
import { processGraphs } from "../processors";
import VisualizationTitle from "./VisualizationTitle";

interface BarGraphProps extends ChartProps {
    category?: string;
    series?: string;
}

const BarGraph = ({
    visualization,
    category,
    series,
    layoutProperties,
    dataProperties,
    section,
    data,
}: BarGraphProps) => {
    const metadata = useStore($visualizationMetadata);
    let availableProperties: { [key: string]: any } = {
        layout: {
            legend: { x: 0.5, y: -0.1, orientation: "h" },
            yaxis: { automargin: true },
            colorway: [
                "#1f77b4",
                "#ff7f0e",
                "#2ca02c",
                "#d62728",
                "#9467bd",
                "#8c564b",
                "#e377c2",
                "#7f7f7f",
                "#bcbd22",
            ],
        },
    };
    Object.entries(layoutProperties || {}).forEach(([property, value]) => {
        update(availableProperties, property, () => value);
    });
    const colors = availableProperties.layout.colorway;
    const { chartData, allSeries } = processGraphs(
        data,
        category,
        series,
        dataProperties,
        metadata[visualization.id]
    );
    return (
        <Stack h="100%" spacing={0} w="100%">
            {((visualization.showTitle !== undefined &&
                visualization.showTitle === true &&
                visualization.name) ||
                (visualization.showTitle === undefined &&
                    visualization.name)) && (
                <VisualizationTitle
                    section={section}
                    title={visualization.name}
                />
            )}
            <Stack flex={1} direction="column">
                <Stack flex={1}>
                    <Plot
                        data={chartData}
                        layout={{
                            margin: {
                                pad: 5,
                                r: 10,
                                t: 0,
                                l: 50,
                                b: 0,
                            },
                            autosize: true,
                            showlegend: false,
                            xaxis: {
                                automargin: true,
                                showgrid: false,
                                type: "category",
                            },
                            ...availableProperties.layout,
                        }}
                        style={{ width: "100%", height: "100%" }}
                        config={{
                            displayModeBar: true,
                            responsive: true,
                            toImageButtonOptions: {
                                format: "svg",
                                scale: 1,
                            },
                            modeBarButtonsToRemove: exclusions,
                            displaylogo: false,
                        }}
                    />
                </Stack>
                <Stack direction="row" spacing="20px" justify="center">
                    {allSeries
                        .filter((v) => !isEmpty(v))
                        .map((series, index) => (
                            <Stack
                                direction="row"
                                spacing="2px"
                                alignItems="center"
                                key={index}
                            >
                                <Text bgColor={colors[index]} w="10px" h="10px">
                                    &nbsp;
                                </Text>
                                <Text noOfLines={[1, 2, 3]}>{series}</Text>
                            </Stack>
                        ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default BarGraph;

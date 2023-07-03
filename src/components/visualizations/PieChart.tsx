import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { $visualizationMetadata } from "../../Store";
import { exclusions } from "../../utils/utils";
import { processPieChart } from "../processors";
import VisualizationTitle from "./VisualizationTitle";
import { flatten } from "lodash";

interface PieChartProps extends ChartProps {
    labels?: string;
    values?: string;
    layoutProperties?: { [key: string]: any };
}

const PieChart = ({
    visualization,
    labels,
    values,
    dataProperties,
    layoutProperties,
    section,
    data,
}: PieChartProps) => {
    const metadata = useStore($visualizationMetadata);
    let availableProperties: { [key: string]: any } = {
        layout: {
            legend: { x: 0.5, y: -0.3, orientation: "h" },
            yaxis: { automargin: true },
        },
    };
    const summarize = visualization.properties["summarize"] || false;
    return (
        <Stack w="100%" h="100%" spacing={0}>
            {visualization.name && (
                <VisualizationTitle
                    section={section}
                    title={visualization.name}
                />
            )}
            <Stack h="100%" w="100%" flex={1}>
                <Plot
                    data={processPieChart(
                        flatten(data),
                        summarize,
                        labels,
                        values,
                        visualization.properties,

                    )}
                    layout={{
                        margin: {
                            pad: 0,
                            r: 0,
                            t: 0,
                            l: 0,
                            b: 0,
                        },
                        autosize: true,
                        showlegend: false,
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
        </Stack>
    );
};

export default PieChart;

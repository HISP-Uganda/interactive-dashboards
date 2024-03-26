import React from "react";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { Stack, Text } from "@chakra-ui/react";
import { $visualizationData, $visualizationMetadata } from "../../Store";
import { useStore } from "effector-react";

interface HeatMapProps extends ChartProps {
    category?: string;
    series?: string;
    traces?: string;
}

const HeatMap = ({ visualization }: HeatMapProps) => {
    const visualizationData = useStore($visualizationData)?.[visualization.id];
    const metadata = useStore($visualizationMetadata)?.[visualization.id];

    const data = Object.values(visualizationData || {}).map((i) => ({
        name: metadata?.[i.pe] || "",
        value: parseFloat(i.value),
    }));

    const labels = data.map((i) => i.name + " " + i.value.toFixed(2));
    const values = data.map((i) => i.value);
    const trace = {
        x: [1],
        y: labels,
        z: [values],
        type: "heatmap",
        colorscale: [
            [0, visualization.properties?.color?.[0] || "#4287f5"],
            [1, "#ffffff"],
        ],
        text: labels,
        hoverinfo: "text",
        name: "Heatmap",
    };

    const datas: any = [trace];

    return (
        <Plot
            data={datas}
            layout={{
                width: 600,
                height: 350,
                title: visualization.showTitle ? "Heatmap" : "",
                xaxis: {
                    showticklabels: false,
                    side: "top",
                },
                yaxis: {
                    showticklabels: false,
                    ticksuffix: " ",
                },
            }}
            style={{ width: "100%", height: "100%" }}
            config={{ displayModeBar: false, responsive: true }}
        />
    );
};

export default HeatMap;

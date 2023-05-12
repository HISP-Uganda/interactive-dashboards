
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { useStore } from "effector-react";
import { $visualizationMetadata } from "../../Store";
import { $visualizationData } from "../../Store";

interface HistogramProps extends ChartProps {
  category?: string;
  series?: string;
}

const Histogram = ({ visualization }: HistogramProps) => {
  // Get the visualization data and metadata from the store
  const visualizationData = useStore($visualizationData)?.[visualization.id];
  const metadata = useStore($visualizationMetadata)?.[visualization.id];

  // Map the data to an array of objects with name and value properties
  const data = Object.values(visualizationData || {}).map((item) => ({
    name: metadata?.[item.pe]?.name || '',
    value: parseFloat(item.value),
  }));

  // Combine name and value into one label for each bar
  const labels = data.map((item) => item.name + ' ' + item.value.toFixed(2));

  // Get the values for the histogram
  const values = data.map((item) => item.value);

  // Create the trace object for the histogram
  const trace = {
    x: values,
    type: "histogram",
    marker: {
      color: '#4287f5', // set the color of the bars
    },
    text: labels, // Set the labels for each bar
    hoverinfo: 'text', // Show the labels when hovering over a bar
    name: 'Histogram', // Add a name for the trace to display in the legend
  };

  // Create an array of trace objects to pass to the Plot component
  const datas: any = [trace];

  return (
    <Plot
      data={datas}
      layout={{
        margin: { l: 40, r: 10, b: 50, t: 30 }, // Add margin to make room for axis labels
        width: 600,
        height: 350,
        title: 'Histogram',
        xaxis: {
          title: 'Values',
          tickformat: '.2f', // set the format of the tick labels
        },
        yaxis: {
          title: 'Frequency',
        },
        showlegend: true, // Display the legend
        bargap: 0.001, // Add a small gap between each bar
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default Histogram;

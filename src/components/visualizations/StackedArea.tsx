import { useStore } from 'effector-react';
import Plot from 'react-plotly.js';
import { ChartProps } from '../../interfaces';
import { $visualizationData } from '../../Store';
import { $visualizationMetadata } from '../../Store';

interface StackedAreaProps extends ChartProps {
  category?: string;
  series?: string;
}

const StackedArea = ({ visualization }: StackedAreaProps) => {
  const visualizationData = useStore($visualizationData)?.[visualization.id];
  const metadata = useStore($visualizationMetadata)?.[visualization.id];

  const traces = visualizationData?.reduce((acc: any, data: any, i: number) => {
    const monthData = metadata?.[data.pe];
    const seriesName = data.series;
    const category = data.category;
    const value = parseFloat(data.value);

    if (!acc[seriesName]) {
      acc[seriesName] = {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines',
        name: seriesName,
        stackgroup: 'one',
      };
    }

    acc[seriesName].x.push(monthData?.name);
    acc[seriesName].y.push(value);

    return acc;
  }, {});

  return (
    <Plot
      data={Object.values(traces)}
      layout={{
        title: 'Stacked Area Chart',
        xaxis: {
          title: 'Month',
        },
        yaxis: {
          title: 'Doses Given',
        },
        showlegend: true,
      }}
      style={{ width: '100%', height: '100%' }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};

export default StackedArea;

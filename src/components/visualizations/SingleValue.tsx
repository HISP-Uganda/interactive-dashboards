import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { processSingleValue } from "../processors";

type SingleValueProps = {
  visualization: IVisualization;
  valueformat?: string;
  prefix?: string;
  suffix?: string;
  valueSize?: number | undefined;
  titleSize?: number | undefined;
  valueColor?: string;
  titleColor?: string;
};

const SingleValue = ({
  visualization,
  valueformat,
  prefix,
  suffix,
  valueSize,
  titleSize,
  valueColor,
  titleColor,
}: SingleValueProps) => {
  const visualizationData = useStore($visualizationData);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];
  return (
    <Plot
      data={[
        {
          type: "indicator",
          mode: "number",
          number: {
            valueformat: "",
            prefix,
            suffix,
            font: {
              size: valueSize,
              color: valueColor,
            },
          },
          value: processSingleValue(data),
        },
      ]}
      layout={{
        margin: { t: 0, r: 0, l: 0, b: 0, pad: 0 },
        autosize: true,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
  );
};
export default SingleValue;

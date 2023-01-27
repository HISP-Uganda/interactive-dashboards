import React from "react";
import { ChartProps } from "../../interfaces";

interface HeatMapProps extends ChartProps {
  category?: string;
  series?: string;
}
const HeatMap = ({}: HeatMapProps) => {
  return <div></div>;
};

export default HeatMap;

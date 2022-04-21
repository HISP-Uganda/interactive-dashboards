import React from "react";
import { IVisualization } from "../../interfaces";
import SingleValue from "./SingleValue";

type VisualizationProps = {
  visualization?: IVisualization;
};

const Visualization = ({ visualization }: VisualizationProps) => {
  const displayProperties = (visualizationType: string | undefined) => {
    const allTypes: any = {
      single: <SingleValue visualization={visualization} />,
    };
    if (visualizationType) {
      return allTypes[visualizationType] || null;
    }
    return null;
  };
  return <>{displayProperties(visualization?.type)}</>;
};

export default Visualization;

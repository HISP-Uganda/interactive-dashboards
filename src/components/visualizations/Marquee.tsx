import React from "react";
import { IVisualization } from "../../interfaces";

type Marquee = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const Marquee = ({
  visualization,
  layoutProperties,
  dataProperties,
}: Marquee) => {
  return <div>Marquee</div>;
};

export default Marquee;

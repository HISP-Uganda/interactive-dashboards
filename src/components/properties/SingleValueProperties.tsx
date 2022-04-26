import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import { HexColorInput } from "react-colorful";
import { useStore } from "effector-react";
import { $store } from "../../Store";
import { displayDataSourceType } from "../data-sources";
import { IVisualization } from "../../interfaces";
import { changeVisualizationProperties } from "../../Events";

type SingleProps = {
  visualization: IVisualization;
};
const SingleValueProperties = ({ visualization }: SingleProps) => {
  return (
    <Stack>
      <HexColorInput
        color={visualization.properties["valueColor"] || "none"}
        onChange={(newColor: string) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "valueColor",
            value: newColor,
          })
        }
      />
    </Stack>
  );
};

export default SingleValueProperties;

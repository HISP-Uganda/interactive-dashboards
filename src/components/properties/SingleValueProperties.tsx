import { Stack } from "@chakra-ui/react";
import { HexColorInput } from "react-colorful";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization } from "../../interfaces";

const SingleValueProperties = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
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

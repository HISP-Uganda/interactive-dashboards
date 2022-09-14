import React, { useState } from "react";
import { Stack, Text } from "@chakra-ui/react";
import { IDashboard, IVisualization, ISection } from "../../interfaces";
import VisualizationMenu from "./VisualizationMenu";
import { useStore } from "effector-react";
import { $dashboard } from "../../Store";

type VisualizationTitleProps = {
  titleFontSize: string;
  titleCase: "lowercase" | "uppercase" | "capitalize";
  titleColor: string;
  visualization: IVisualization;
  section: ISection;
};

const VisualizationTitle = ({
  titleFontSize,
  titleCase,
  titleColor,
  visualization,
  section,
}: VisualizationTitleProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyItems="center"
      alignContent="center"
      justifyContent="center"
      _hover={{ bg: "gray.300" }}
      h="30px"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      bg="gray.200"
    >
      <Text
        textAlign="center"
        noOfLines={1}
        fontSize={titleFontSize}
        textTransform={titleCase}
        color={titleColor}
        flex={1}
      >
        {visualization.name}
      </Text>
      {showMenu && <VisualizationMenu section={section} />}
    </Stack>
  );
};

export default VisualizationTitle;

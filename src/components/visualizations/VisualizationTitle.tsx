import React, { useState } from "react";
import { Stack, StackProps, Text } from "@chakra-ui/react";
import { IDashboard, IVisualization, ISection } from "../../interfaces";
import VisualizationMenu from "./VisualizationMenu";
import { useStore } from "effector-react";
import { $dashboard } from "../../Store";

interface VisualizationTitleProps extends StackProps {
  title: string;
  section: ISection;
};

const VisualizationTitle = ({
  title,
  section,
  ...rest
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
      {...rest}
    >
      <Text
        textAlign="center"
        noOfLines={1}
        flex={1}
      >
        {title}
      </Text>
      {showMenu && <VisualizationMenu section={section} />}
    </Stack>
  );
};

export default VisualizationTitle;

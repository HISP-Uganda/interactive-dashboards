import { Box, Stack, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { changeVisualizationProperties } from "../Events";
import { IVisualization } from "../interfaces";

type ColorPalletProps = {
  visualization: IVisualization;
  attribute: string;
};

const ColorPalette = ({ visualization, attribute }: ColorPalletProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = React.useRef(null);
  useOnClickOutside(ref, onClose);
  return (
    <Stack position="relative">
      <Text bg={visualization.properties?.[attribute] || ""} onClick={onToggle}>
        &nbsp;
      </Text>
      {isOpen && (
        <Box bottom={0} top={7} zIndex={1000} position="absolute">
          <SwatchesPicker
            color={visualization.properties?.[attribute] || ""}
            onChangeComplete={(color) => {
              changeVisualizationProperties({
                visualization: visualization.id,
                attribute: attribute,
                value: color.hex,
              });
              onClose();
            }}
          />
        </Box>
      )}
    </Stack>
  );
};

export default ColorPalette;

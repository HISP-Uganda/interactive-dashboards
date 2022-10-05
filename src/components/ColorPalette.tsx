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
    <Stack position="relative" bg="gray.400" p="5px">
      <Text
        // width="36px"
        height="24px"
        borderRadius="2px"
        bg={visualization.properties?.[attribute] || "black"}
        onClick={onToggle}
      >
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

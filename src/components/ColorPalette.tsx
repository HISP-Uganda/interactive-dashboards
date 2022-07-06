import React from "react";
import {
  Box,
  Button,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PeriodDimension } from "@dhis2/analytics";
import useOnClickOutside from "use-onclickoutside";
import { Item, PickerProps } from "../interfaces";

const colors: string[][] = [
  [
    "#303638",
    "#f0c808",
    "#5d4b20",
    "#469374",
    "#9341b3",
    "#e3427d",
    "#e68653",
    "#ebe0b0",
    "#edfbba",
  ],
  [
    "#6a00ff",
    "#ff00ff",
    "#ff0040",
    "#ff9500",
    "#ffff00",
    "#aaff00",
    "#00ff15",
    "#00ffff",
    "#0095ff",
  ],
];

type ColorPalletProps = {
  value: string[];
};

const ColorPalette = ({ value }: ColorPalletProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = React.useRef(null);
  useOnClickOutside(ref, onClose);
  return (
    <Stack position="relative">
      <SimpleGrid
        columns={value.length}
        spacing={0}
        w="400px"
        onClick={onToggle}
      >
        {value.map((c) => (
          <Box bg={c} key={c} height="35px">
            <Text>&nbsp;</Text>
          </Box>
        ))}
      </SimpleGrid>
      {isOpen && (
        <Box bottom={0} top={7} zIndex={1000} position="absolute">
          <Stack spacing="5px">
            {colors.map((color) => (
              <SimpleGrid
                key={String(color)}
                columns={color.length}
                spacing={0}
                w="400px"
                onClick={() => console.log(color)}
              >
                {color.map((c) => (
                  <Box bg={c} key={c} height="35px">
                    <Text>&nbsp;</Text>
                  </Box>
                ))}
              </SimpleGrid>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default ColorPalette;

import { DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { changeVisualizationProperties } from "../Events";
import { IVisualization } from "../interfaces";
import { swatchColors } from "../utils/utils";

type ColorPalletProps = {
    visualization: IVisualization;
    attribute: string;
};

const ColorPalette = ({ visualization, attribute }: ColorPalletProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const ref = React.useRef(null);
    useOnClickOutside(ref, onClose);
    return (
        <Stack
            position="relative"
            bgColor="gray.400"
            direction="row"
            spacing="0"
        >
            <Text
                flex={1}
                bgColor={visualization.properties?.[attribute] || "black"}
                onClick={onToggle}
            />
            <IconButton
                aria-label="delete"
                bgColor="none"
                borderRadius="none"
                icon={<DeleteIcon w={3} h={3} />}
                onClick={() =>
                    changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: attribute,
                        value: "",
                    })
                }
            />
            {isOpen && (
                <Box bottom={0} top="42px" zIndex={1000} position="absolute">
                    <SwatchesPicker
                        colors={swatchColors}
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

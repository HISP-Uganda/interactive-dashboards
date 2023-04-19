import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, useDisclosure, IconButton } from "@chakra-ui/react";
import React from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { changeSectionAttribute } from "../Events";
import { ISection } from "../interfaces";
import { swatchColors } from "../utils/utils";

type ColorPalletProps = {
    section: ISection;
};

const SectionColorPalette = ({ section }: ColorPalletProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const ref = React.useRef(null);
    useOnClickOutside(ref, onClose);
    return (
        <Stack
            position="relative"
            bgColor="gray.400"
            spacing={0}
            direction="row"
        >
            <Text flex={1} bgColor={section.bg} onClick={onToggle} />
            <IconButton
                aria-label="delete"
                bgColor="none"
                borderRadius="none"
                icon={<DeleteIcon w={3} h={3} />}
                onClick={() =>
                    changeSectionAttribute({
                        attribute: "bg",
                        value: "",
                    })
                }
            />
            {isOpen && (
                <Box bottom={0} top={7} zIndex={1000} position="absolute">
                    <SwatchesPicker
                        colors={swatchColors}
                        color={section.bg}
                        onChangeComplete={(color) => {
                            changeSectionAttribute({
                                attribute: "bg",
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

export default SectionColorPalette;

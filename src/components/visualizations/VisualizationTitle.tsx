import { Spacer, Stack, StackProps, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ISection } from "../../interfaces";
import VisualizationMenu from "./VisualizationMenu";

interface VisualizationTitleProps extends StackProps {
    title: string;
    section: ISection;
}

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
            h="3vh"
            maxH="3vh"
            onMouseEnter={() => setShowMenu(() => true)}
            onMouseLeave={() => setShowMenu(() => false)}
            bgColor="gray.200"
            // zIndex={1000}
            w="100%"
            fontSize="1.4vh"
            color={"gray.500"}
            fontWeight="bold"
            px="5px"
            {...rest}
        >
            <Text textAlign="center" noOfLines={1}>
                {title}
            </Text>
            <Spacer />
            {showMenu && <VisualizationMenu section={section} />}
        </Stack>
    );
};

export default VisualizationTitle;

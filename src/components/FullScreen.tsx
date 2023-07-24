import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Stack,
} from "@chakra-ui/react";
import { ISection } from "../interfaces";
import Visualization from "./visualizations/Visualization";

export default function FullScreen({
    section,
    isFull,
    onUnFull,
}: {
    section: ISection;
    isFull: boolean;
    onUnFull: () => void;
}) {
    return (
        <Modal isOpen={isFull} onClose={onUnFull} size="full">
            <ModalOverlay />
            <ModalContent
                h="100vh"
                display="flex"
                flexDirection="column"
                w="100vw"
            >
                <ModalBody>
                    <Stack h="100%" w="100%" direction={section?.direction}>
                        {section?.visualizations.map((visualization) => (
                            <Visualization
                                key={visualization.id}
                                visualization={visualization}
                                section={section}
                            />
                        ))}
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

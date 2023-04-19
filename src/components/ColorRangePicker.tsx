import {
    IconButton,
    Input,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    Text,
    Spacer,
} from "@chakra-ui/react";
import { ChangeEvent, useRef, useState } from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { changeVisualizationProperties } from "../Events";
import { IVisualization, Threshold } from "../interfaces";
import { generateUid } from "../utils/uid";
import { swatchColors } from "../utils/utils";

export default function ({ visualization }: { visualization: IVisualization }) {
    const ref = useRef(null);

    const [id, setId] = useState<string>("");
    const [thresholds, setThresholds] = useState<Threshold[]>(
        visualization.properties?.["data.thresholds"] || []
    );
    const { isOpen, onClose, onOpen } = useDisclosure();

    const addThreshold = () => {
        const threshold: Threshold = {
            id: generateUid(),
            color: "#333",
            min: "50",
            max: "100",
        };
        const all = [...thresholds, threshold];
        changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.thresholds",
            value: all,
        });
        setThresholds(() => all);
    };

    const removeThreshold = (id: string) => {
        const filtered = thresholds.filter((threshold) => threshold.id !== id);
        changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.thresholds",
            value: filtered,
        });
        setThresholds(() => filtered);
    };
    useOnClickOutside(ref, onClose);
    const changeThreshold = (
        id: string,
        attribute: "color" | "min" | "max",
        value: string
    ) => {
        const processed = thresholds.map((threshold) => {
            if (threshold.id === id) {
                return { ...threshold, [attribute]: value };
            }
            return threshold;
        });
        changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.thresholds",
            value: processed,
        });
        setThresholds(() => processed);
    };
    return (
        <Stack>
            <Stack direction="row" alignItems="center">
                <Text>Threshold</Text>
                <Spacer />
                <IconButton
                    bgColor="none"
                    aria-label="add"
                    icon={<AddIcon w={2} h={2} />}
                    onClick={() => addThreshold()}
                />
            </Stack>

            <TableContainer>
                <Table variant="simple" size="xs">
                    <Thead>
                        <Tr>
                            <Th>Min</Th>
                            <Th>Max</Th>
                            <Th>Color</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody ref={ref}>
                        {thresholds.map((hold) => (
                            <Tr key={hold.id}>
                                <Td w="35%">
                                    <Input
                                        value={hold.min}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            changeThreshold(
                                                hold.id,
                                                "min",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Td>
                                <Td w="35%">
                                    <Input
                                        value={hold.max}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            changeThreshold(
                                                hold.id,
                                                "max",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Td>
                                <Td
                                    w="20%"
                                    bgColor={hold.color}
                                    position="relative"
                                    onClick={() => {
                                        setId(() => hold.id);
                                        onOpen();
                                    }}
                                >
                                    {isOpen && id === hold.id && (
                                        <SwatchesPicker
                                            colors={swatchColors}
                                            key={hold.id}
                                            color={hold.color}
                                            onChangeComplete={(color) => {
                                                changeThreshold(
                                                    hold.id,
                                                    "color",
                                                    color.hex
                                                );
                                                onClose();
                                            }}
                                        />
                                    )}
                                </Td>
                                <Td textAlign="right" w="10%">
                                    <IconButton
                                        aria-label="delete"
                                        bgColor="none"
                                        icon={<DeleteIcon w={3} h={3} />}
                                        onClick={() => removeThreshold(hold.id)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Stack>
    );
}

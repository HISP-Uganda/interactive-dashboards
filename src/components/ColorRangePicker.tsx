import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Table,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    Text,
} from "@chakra-ui/react";
import { sum } from "lodash";
import { useState } from "react";
import { sectionApi } from "../Events";
import { IVisualization, Threshold } from "../interfaces";
import { generateUid } from "../utils/uid";
import Picker from "./Picker";

export default function ({ visualization }: { visualization: IVisualization }) {
    const [thresholds, setThresholds] = useState<Threshold[]>(
        visualization.properties?.["data.thresholds"] || [
            { id: "baseline", color: "#444", value: -1 },
        ]
    );

    const addThreshold = () => {
        const threshold: Threshold = {
            id: generateUid(),
            color: "#333",
            value: sum(thresholds.map((threshold) => threshold.value)) + 20,
        };
        const all = [...thresholds, threshold];
        sectionApi.changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.thresholds",
            value: all,
        });
        setThresholds(() => all);
    };

    const removeThreshold = (id: string) => {
        const filtered = thresholds.filter((threshold) => threshold.id !== id);
        sectionApi.changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.thresholds",
            value: filtered,
        });
        setThresholds(() => filtered);
    };

    const changeThreshold = (
        id: string,
        attribute: keyof Threshold,
        value: string | number
    ) => {
        const processed = thresholds.map((threshold) => {
            if (threshold.id === id) {
                return { ...threshold, [attribute]: value };
            }
            return threshold;
        });
        sectionApi.changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.thresholds",
            value: processed,
        });
        setThresholds(() => processed);
    };
    return (
        <Stack>
            <Stack alignItems="center" direction="row">
                <Picker
                    color={
                        thresholds.find(({ id }) => id === "baseline")?.color ||
                        "red"
                    }
                    onChange={(color) =>
                        changeThreshold("baseline", "color", color)
                    }
                />
                <Text>Baseline</Text>
            </Stack>
            <Table variant="unstyled">
                <Tbody>
                    {thresholds
                        .filter(({ id }) => id !== "baseline")
                        .map((hold) => (
                            <Tr key={hold.id}>
                                <Td>
                                    <Picker
                                        color={hold.color}
                                        onChange={(color) =>
                                            changeThreshold(
                                                hold.id,
                                                "color",
                                                color
                                            )
                                        }
                                    />
                                </Td>

                                <Td>
                                    <NumberInput
                                        value={hold.value}
                                        min={0}
                                        size="sm"
                                        onChange={(
                                            value1: string,
                                            value2: number
                                        ) =>
                                            changeThreshold(
                                                hold.id,
                                                "value",
                                                value2
                                            )
                                        }
                                        step={0.1}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
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
                <Tfoot>
                    <Tr>
                        <Td colSpan={3} textAlign="right">
                            <IconButton
                                bgColor="none"
                                aria-label="add"
                                icon={<AddIcon w={2} h={2} />}
                                onClick={() => addThreshold()}
                            />
                        </Td>
                    </Tr>
                </Tfoot>
            </Table>
        </Stack>
    );
}

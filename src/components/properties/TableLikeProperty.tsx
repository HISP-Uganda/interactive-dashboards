import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Input,
    Table,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { fromPairs } from "lodash";
import React, { useState } from "react";
import { sectionApi } from "../../Events";
import { VizProps } from "../../interfaces";
import { generateUid } from "../../utils/uid";

export default function TableLikeProperty<TData extends { id: string }>({
    visualization,
    attribute,
    title,
    columns,
}: VizProps & { columns: Array<{ label: string; value: keyof TData }> }) {
    const [thresholds, setThresholds] = useState<TData[]>(
        visualization.properties[attribute] || []
    );

    const addThreshold = () => {
        const threshold = {
            id: generateUid(),
            ...fromPairs(columns.map(({ value }) => [value, ""])),
        } as TData;
        const all = [...thresholds, threshold];
        sectionApi.changeVisualizationProperties({
            visualization: visualization.id,
            attribute,
            value: all,
        });
        setThresholds(() => all);
    };

    const removeThreshold = (id: string) => {
        const filtered = thresholds.filter((threshold) => threshold.id !== id);
        sectionApi.changeVisualizationProperties({
            visualization: visualization.id,
            attribute,
            value: filtered,
        });
        setThresholds(() => filtered);
    };

    const changeThreshold = (
        id: string,
        attribute: keyof TData,
        value: any
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
        <Table variant="unstyled">
            <Thead>
                <Tr>
                    {columns.map(({ label }) => (
                        <Th key={label}>{label}</Th>
                    ))}
                    <Td textAlign="right" w="10%"></Td>
                </Tr>
            </Thead>
            <Tbody>
                {thresholds.map((hold) => (
                    <Tr key={hold.id}>
                        {columns.map(({ value }) => (
                            <Td key={`${hold.id}${value}`}>
                                <Input
                                    value={String(hold[value])}
                                    onChange={(e) =>
                                        changeThreshold(
                                            hold.id,
                                            value,
                                            e.target.value
                                        )
                                    }
                                />
                            </Td>
                        ))}
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
    );
}

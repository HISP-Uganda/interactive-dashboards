import { useState, ReactNode } from "react";
import { Stack, Text } from "@chakra-ui/react";

export default function SimpleAccordion({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    const [isActive, setIsActive] = useState(false);
    return (
        <Stack h="100%" w="100%">
            <Stack
                onClick={() => setIsActive(!isActive)}
                direction="row"
                alignItems="center"
                bg="gray.200"
                h="28px"
                p="5px"
                cursor="pointer"
            >
                <Text>{isActive ? "-" : "+"}</Text>
                <Text>{title}</Text>
            </Stack>
            {isActive && (
                <Stack px="20px" spacing="20px">
                    {children}
                </Stack>
            )}
        </Stack>
    );
}

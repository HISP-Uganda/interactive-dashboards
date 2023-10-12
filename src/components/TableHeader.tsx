import { Thead } from "@chakra-ui/react";
import React from "react";

export default function TableHeader({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Thead position="sticky" top="0" bgColor="white" zIndex={1}>
            {children}
        </Thead>
    );
}

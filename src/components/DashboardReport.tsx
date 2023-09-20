import React from "react";
import { IDashboard, ISection } from "../interfaces";
import { Stack } from "@chakra-ui/react";
import SectionVisualization from "./SectionVisualization";
export default function DashboardReport({
    dashboard,
}: {
    dashboard: IDashboard;
}) {
    return (
        <>
            {dashboard?.sections.map((section: ISection, index: number) => {
                return (
                    <Stack
                        bgColor={section.bg}
                        key={section.id}
                        id={section.id}
                        w="800px"
                        position="absolute"
                        style={{ pageBreakAfter: "always" }}
                        h={
                            section.visualizations.find(
                                ({ type, actualType }) =>
                                    type === "tables" || actualType === "tables"
                            )
                                ? undefined
                                : "794px"
                        }
                        // p="5px"
                    >
                        <SectionVisualization {...section} />
                    </Stack>
                );
            })}
        </>
    );
}

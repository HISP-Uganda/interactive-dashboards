import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { DragEvent, MouseEvent, useRef } from "react";
import { dashboardApi, sectionApi } from "../Events";
import { IDashboard, ISection } from "../interfaces";
import { $dimensions, $store, isOpenApi } from "../Store";
import SectionVisualization from "./SectionVisualization";

export default function FixedDashboardTemplate({
    dashboard,
}: {
    dashboard: IDashboard;
}) {
    const store = useStore($store);
    const { isNotDesktop } = useStore($dimensions);
    const dragItem = useRef<number | undefined | null>();

    const dragOverItem = useRef<number | null>();
    const templateColumns = useBreakpointValue({
        base: "auto",
        sm: "auto",
        md: "auto",
        lg: `repeat(${dashboard.columns}, 1fr)`,
    });
    const templateRows = useBreakpointValue({
        base: "auto",
        sm: "auto",
        md: "auto",
        lg: `repeat(${dashboard.rows}, 1fr)`,
    });

    const dragStart = (e: DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
    };

    const dragEnter = (e: DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
    };

    const drop = (e: DragEvent<HTMLDivElement>) => {
        const copyListItems = [...dashboard.sections];
        if (
            dragItem.current !== null &&
            dragItem.current !== undefined &&
            dragOverItem.current !== null &&
            dragOverItem.current !== undefined
        ) {
            const dragItemContent = copyListItems[dragItem.current];
            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(dragOverItem.current, 0, dragItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            dashboardApi.setSections(copyListItems);
        }
    };

    return (
        <Grid
            templateColumns={templateColumns}
            templateRows={templateRows}
            gap={`${dashboard.spacing}px`}
            h="100%"
            w="100%"
        >
            {dashboard?.sections.map((section: ISection, index: number) => (
                <GridItem
                    draggable
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={(e) => dragEnter(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={drop}
                    bgColor={section.bg}
                    key={section.id}
                    id={section.id}
                    colSpan={{ lg: section.colSpan, md: 1 }}
                    rowSpan={{ lg: section.rowSpan, md: 1 }}
                    h={
                        isNotDesktop
                            ? section.height
                                ? section.height
                                : "15vh"
                            : "100%"
                    }
                    maxH={
                        isNotDesktop
                            ? section.height
                                ? section.height
                                : "15vh"
                            : "100%"
                    }
                    onClick={(e: MouseEvent<HTMLElement>) => {
                        if (e.detail === 2 && store.isAdmin) {
                            sectionApi.setCurrentSection(section);
                            isOpenApi.onOpen();
                        }
                    }}
                >
                    <SectionVisualization {...section} />
                </GridItem>
            ))}
            <Outlet />
        </Grid>
    );
}

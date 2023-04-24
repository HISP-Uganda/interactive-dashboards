import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { DragEvent, MouseEvent, useRef } from "react";
import { setCurrentSection, setSections } from "../Events";
import { ISection } from "../interfaces";
import { $dashboard, $dimensions, $store, isOpenApi } from "../Store";
import SectionVisualization from "./SectionVisualization";
export default function FixedDashboard() {
    const store = useStore($store);
    const dashboard = useStore($dashboard);
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
            setSections(copyListItems);
        }
    };
    return (
        <Grid
            templateColumns={templateColumns}
            templateRows={templateRows}
            gap="5px"
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
                            setCurrentSection(section);
                            isOpenApi.onOpen();
                        }
                    }}
                >
                    <SectionVisualization {...section} />
                </GridItem>
            ))}
        </Grid>
    );
}

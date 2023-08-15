import {
    Box,
    SimpleGrid,
    Stack,
    useDisclosure,
    Grid,
    useBreakpointValue,
    GridItem,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import {
    Item,
    Menu,
    Separator,
    Submenu,
    useContextMenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import Marquee from "react-marquee-slider";
import { sectionApi } from "../Events";
import { ISection } from "../interfaces";
import { $store, isOpenApi, $dashboard } from "../Store";
import FullScreen from "./FullScreen";
import Carousel from "./visualizations/Carousel";
import TabPanelVisualization from "./visualizations/TabPanelVisualization";
import Visualization from "./visualizations/Visualization";
import VisualizationTitle from "./visualizations/VisualizationTitle";

const SectionVisualization = (section: ISection) => {
    const dashboard = useStore($dashboard);
    const { show } = useContextMenu({
        id: section.id,
    });
    const store = useStore($store);
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

    function handleItemClick({ event, props, triggerEvent, data }: any) {
        console.log(event, props, triggerEvent, data);
    }

    function displayMenu(e: any) {
        show({
            event: e,
        });
    }

    const displays = {
        carousel: <Carousel {...section} />,
        marquee: (
            <Stack
                key={section.id}
                bg={section.bg}
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                justifyItems="center"
                w="100%"
                h="100%"
                onClick={(e: MouseEvent<HTMLElement>) => {
                    if (e.detail === 2 && store.isAdmin) {
                        sectionApi.setCurrentSection(section);
                        isOpenApi.onOpen();
                    }
                }}
            >
                <Stack w="100%">
                    <Marquee
                        velocity={60}
                        direction="rtl"
                        onFinish={() => {}}
                        resetAfterTries={200}
                        scatterRandomly={false}
                        onInit={() => {}}
                    >
                        {section.visualizations.map((visualization) => {
                            return (
                                <Stack direction="row" key={visualization.id}>
                                    <Visualization
                                        section={section}
                                        key={visualization.id}
                                        visualization={visualization}
                                    />
                                    <Box w="70px">&nbsp;</Box>
                                </Stack>
                            );
                        })}
                    </Marquee>
                </Stack>
            </Stack>
        ),
        grid: (
            <Grid
                h="100%"
                w="100%"
                bg={section.bg}
                key={section.id}
                templateColumns={templateColumns}
                templateRows={templateRows}
                gap={`${dashboard.spacing}px`}
                flex={1}
                // alignItems="center"
                // justifyContent="center"
            >
                {section.visualizations.map((visualization) => {
                    return (
                        <GridItem
                            colSpan={visualization.columns}
                            rowSpan={visualization.rows}
                            w="100%"
                            h="100%"
                            key={visualization.id}
                            bgColor={visualization.properties["layout.bg"]}
                        >
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                spacing={0}
                                p="0"
                                w="100%"
                                h="100%"
                            >
                                <Visualization
                                    key={visualization.id}
                                    visualization={visualization}
                                    section={section}
                                />
                            </Stack>
                        </GridItem>
                    );
                })}
            </Grid>
        ),
        normal: (
            <Stack h="100%" w="100%" spacing={0} key={section.id} flex={1}>
                {section.title && (
                    <VisualizationTitle
                        section={section}
                        title={section.title}
                    />
                )}
                <Stack
                    alignItems={section.alignItems}
                    justifyContent={section.justifyContent || "space-around"}
                    direction={section.direction}
                    w="100%"
                    h="100%"
                    bg={section.bg}
                    spacing={section.spacing}
                    p={section.padding}
                >
                    {section.visualizations.map((visualization) => (
                        <Visualization
                            key={visualization.id}
                            visualization={visualization}
                            section={section}
                        />
                    ))}
                </Stack>
            </Stack>
        ),
        tab: <TabPanelVisualization {...section} />,
    };

    const {
        isOpen: isFull,
        onOpen: onFull,
        onClose: onUnFull,
    } = useDisclosure();
    const displayFull = () => {
        onFull();
    };

    return (
        <Stack
            onContextMenu={displayMenu}
            w="100%"
            h="100%"
            overflow="auto"
            spacing={0}
        >
            {displays[section.display] || displays.normal}
            <Menu id={section.id}>
                <Item
                    onClick={() => {
                        sectionApi.setCurrentSection(section);
                        isOpenApi.onOpen();
                    }}
                >
                    Edit
                </Item>
                <Item onClick={() => displayFull()}>Expand</Item>
                <Separator />
                <Item disabled>Disabled</Item>
                <Separator />
                <Submenu label="Submenu">
                    <Item onClick={handleItemClick}>Sub Item 1</Item>
                    <Item onClick={handleItemClick}>Sub Item 2</Item>
                </Submenu>
            </Menu>

            <FullScreen section={section} onUnFull={onUnFull} isFull={isFull} />
        </Stack>
    );
};

export default SectionVisualization;

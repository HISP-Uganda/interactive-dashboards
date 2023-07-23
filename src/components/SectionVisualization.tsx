import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import Marquee from "react-marquee-slider";
import { sectionApi } from "../Events";
import { ISection } from "../interfaces";
import { $store, isOpenApi } from "../Store";
import Carousel from "./visualizations/Carousel";
import TabPanelVisualization from "./visualizations/TabPanelVisualization";
import Visualization from "./visualizations/Visualization";
import { useState, useEffect } from "react";
import VisualizationTitle from "./visualizations/VisualizationTitle";
import VisualizationMenu from "./visualizations/VisualizationMenu";
import ListMenu from "./visualizations/ListMenu";

const SectionVisualization = (section: ISection) => {
    const store = useStore($store);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const handleContextMenu = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        setMenuPosition({ x: mouseX, y: mouseY });
        setShowMenu(true);
    };

    const handleOutsideClick = () => {
        setShowMenu(false);
    };
    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);
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
                onMouseEnter={() => setShowMenu(() => true)}
                onMouseLeave={() => setShowMenu(() => false)}
                w="100%"
                h="100%"
                onClick={(e: MouseEvent<HTMLElement>) => {
                    if (e.detail === 2 && store.isAdmin) {
                        sectionApi.setCurrentSection(section);
                        isOpenApi.onOpen();
                    }
                }}
                //onContextMenu={(e: MouseEvent<HTMLElement>) => { showMenu && <VisualizationMenu section={section} /> }}
                onContextMenu={handleContextMenu}
            >
                <Stack w="100%">
                    {showMenu && <Box
                        top={`${menuPosition.y}px`}
                        left={`${menuPosition.x}px`}
                        zIndex={1000}>
                        <Box>
                            <ListMenu section={section} />
                        </Box>
                    </Box>}
                    <Marquee
                        velocity={60}
                        direction="rtl"
                        onFinish={() => { }}
                        resetAfterTries={200}
                        scatterRandomly={false}
                        onInit={() => { }}
                    >
                        {section.visualizations.map((visualization) => (
                            <Stack direction="row" key={visualization.id}>
                                <Visualization
                                    section={section}
                                    key={visualization.id}
                                    visualization={visualization}
                                />
                                <Box w="70px">&nbsp;</Box>
                            </Stack>
                        ))}
                    </Marquee>
                </Stack>
            </Stack>
        ),
        grid: (
            <Stack
                h="100%"
                w="100%"
                bg={section.bg}
                spacing={0}
                alignItems="center"
                alignContent="center"
                justifyContent="center"
                justifyItems="center"
                key={section.id}
            >
                {section.title && (
                    <VisualizationTitle
                        section={section}
                        title={section.title}
                    />
                )}
                <SimpleGrid columns={2} h="100%" w="100%" flex={1} spacing="0">
                    {section.visualizations.map((visualization, i) => (
                        <Visualization
                            key={visualization.id}
                            visualization={visualization}
                            section={section}
                        />
                    ))}
                </SimpleGrid>
            </Stack>
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
    return displays[section.display] || displays.normal;
};

export default SectionVisualization;

import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import Marquee from "react-marquee-slider";
import { setCurrentSection } from "../Events";
import { ISection } from "../interfaces";
import { $store, isOpenApi } from "../Store";
import Carousel from "./visualizations/Carousel";
import TabPanelVisualization from "./visualizations/TabPanelVisualization";
import Visualization from "./visualizations/Visualization";
import VisualizationTitle from "./visualizations/VisualizationTitle";

const SectionVisualization = (section: ISection) => {
    const store = useStore($store);

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
                        setCurrentSection(section);
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
            <Stack h="100%" w="100%" spacing={0} key={section.id}>
                {section.title && (
                    <VisualizationTitle
                        section={section}
                        title={section.title}
                    />
                )}
                <Stack
                    alignItems="center"
                    justifyItems="center"
                    alignContent="center"
                    justifyContent={section.justifyContent || "space-around"}
                    direction={section.direction}
                    flex={1}
                    w="100%"
                    h="100%"
                    bg={section.bg}
                    spacing="0"
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

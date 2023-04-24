import {
    Stack,
    TabList,
    Tab,
    TabPanels,
    Tabs,
    TabPanel,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useInterval from "react-useinterval";

import { ISection } from "../../interfaces";
import Visualization from "./Visualization";
import VisualizationTitle from "./VisualizationTitle";

const TabPanelVisualization = (section: ISection) => {
    const [tabIndex, setTabIndex] = useState<number>(0);
    const increment = () =>
        setTabIndex((s: number) => (s + 1) % section.visualizations.length);
    useInterval(increment, 1000 * 20);

    return (
        <Stack h="100%" w="100%" flexDirection="column" key={section.id}>
            {section.title && (
                <VisualizationTitle section={section} title={section.title} />
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
            >
                <Tabs
                    flex={1}
                    index={tabIndex}
                    onChange={(index) => setTabIndex(() => index)}
                    h="100%"
                    w="100%"
                    display="flex"
                    flexDirection="column"
                    alignContent="center"
                >
                    <TabList fontSize="1.4vh">
                        {section.visualizations.map((visualization) => (
                            <Tab key={visualization.id}>
                                <Text noOfLines={1}>{visualization.name}</Text>
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanels h="100%">
                        {section.visualizations.map((visualization) => (
                            <TabPanel key={visualization.id} h="100%" w="100%">
                                <Stack
                                    alignItems="center"
                                    alignContent="center"
                                    justifyContent="center"
                                    justifyItems="center"
                                    h="100%"
                                    w="100%"
                                >
                                    <Visualization
                                        key={visualization.id}
                                        visualization={visualization}
                                        section={section}
                                    />
                                </Stack>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            </Stack>
        </Stack>
    );
};

export default TabPanelVisualization;

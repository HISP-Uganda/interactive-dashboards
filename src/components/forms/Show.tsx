import React, { useState, useEffect, useRef } from "react";
import { useStore } from "effector-react";
import { useSpringCarousel } from "react-spring-carousel";

import { $presentation } from "../../Store";
import FixedDashboard from "../FixedDashboard";
import { IDashboard, ISection, IVisualization } from "../../interfaces";
import { Button, Stack } from "@chakra-ui/react";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";
import { dashboardApi } from "../../Events";

export default function Show() {
    const presentation = useStore($presentation);
    const ref = useRef<HTMLDivElement | null>(null);
    const {
        carouselFragment,
        slideToPrevItem,
        slideToNextItem,
        enterFullscreen,
        exitFullscreen,
        getIsFullscreen,
    } = useSpringCarousel({
        withLoop: true,
        itemsPerSlide: 1,
        items: presentation.items.map((item) => {
            if (item.type === "dashboard") {
                dashboardApi.setCurrentDashboard(item.nodeSource as IDashboard);
                return {
                    id: item.key || item.id,
                    renderItem: (
                        <FixedDashboard
                            dashboard={item.nodeSource as IDashboard}
                        />
                    ),
                    renderThumb: item.key,
                };
            } else if (item.type === "section") {
                return {
                    id: item.key || item.id,
                    renderItem: (
                        <SectionVisualization
                            {...(item.nodeSource as ISection)}
                        />
                    ),
                    renderThumb: item.key,
                };
            } else if (item.type === "visualization") {
                return {
                    id: item.key || item.id,
                    renderItem: (
                        <Visualization
                            visualization={item.nodeSource as IVisualization}
                            section={item.parent as ISection}
                        />
                    ),
                    renderThumb: item.key,
                };
            }
            return null;
        }) as any,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            slideToNextItem();
        }, 10000);
        return () => {
            window.clearInterval(timer);
        };
    }, [slideToNextItem]);

    return (
        <Stack
            overflow="hidden"
            width="100%"
            height="100%"
            direction="column"
            spacing={0}
            bg="gray.300"
            // p="5px"
            alignItems="center"
            justifyContent="center"
        >
            <Button
                onClick={() => {
                    if (getIsFullscreen()) {
                        exitFullscreen();
                    } else {
                        enterFullscreen(ref.current ? ref.current : undefined);
                    }
                }}
                position="fixed"
                top="52px"
                right={["16px", "16px", "16px", "16px", "16px"]}
                zIndex={2}
            >
                Toggle fullscreen!
            </Button>
            <Stack ref={ref} flex={1} width="100%" h="100%">
                {carouselFragment}
            </Stack>
        </Stack>
    );
}

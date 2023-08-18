import React, { useState, useEffect, useRef } from "react";
import { useStore } from "effector-react";
import { useSpringCarousel } from "react-spring-carousel";
import useInterval from "react-useinterval";

import { $presentation } from "../../Store";
import FixedDashboard from "../FixedDashboard";
import { IDashboard, ISection, IVisualization } from "../../interfaces";
import { Button, Stack } from "@chakra-ui/react";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";
import { dashboardApi } from "../../Events";

export default function Show2() {
    const presentation = useStore($presentation);

    const [index, setIndex] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);

    const increment = () => {
        let itemSize = presentation.items.length;

        if (!pause) {
            setIndex((s: number) => (s + 1) % itemSize);
        }
    };
    useInterval(increment, 5000 * 10);
    // const ref = useRef<HTMLDivElement | null>(null);
    // const {
    //     carouselFragment,
    //     slideToPrevItem,
    //     slideToNextItem,
    //     enterFullscreen,
    //     exitFullscreen,
    //     getIsFullscreen,
    // } = useSpringCarousel({
    //     withLoop: true,
    //     itemsPerSlide: 1,
    //     items: presentation.items.map((item) => {
    //         if (item.type === "dashboard") {
    //             dashboardApi.setCurrentDashboard(item.nodeSource as IDashboard);
    //             return {
    //                 id: item.key || item.id,
    //                 renderItem: (
    //                     <FixedDashboard
    //                         dashboard={item.nodeSource as IDashboard}
    //                     />
    //                 ),
    //                 renderThumb: item.key,
    //             };
    //         } else if (item.type === "section") {
    //             return {
    //                 id: item.key || item.id,
    //                 renderItem: (
    //                     <SectionVisualization
    //                         {...(item.nodeSource as ISection)}
    //                     />
    //                 ),
    //                 renderThumb: item.key,
    //             };
    //         } else if (item.type === "visualization") {
    //             return {
    //                 id: item.key || item.id,
    //                 renderItem: (
    //                     <Visualization
    //                         visualization={item.nodeSource as IVisualization}
    //                         section={item.parent as ISection}
    //                     />
    //                 ),
    //                 renderThumb: item.key,
    //             };
    //         }
    //         return null;
    //     }) as any,
    // });

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         slideToNextItem();
    //     }, 10000);
    //     return () => {
    //         window.clearInterval(timer);
    //     };
    // }, [slideToNextItem]);

    const item = presentation.items[index];

    if (item.type === "dashboard") {
        dashboardApi.setCurrentDashboard(item.nodeSource as IDashboard);
    }

    if (item.type === "dashboard") {
        return <FixedDashboard dashboard={item.nodeSource as IDashboard} />;
    } else if (item.type === "section") {
        return <SectionVisualization {...(item.nodeSource as ISection)} />;
    } else if (item.type === "visualization") {
        return (
            <Visualization
                visualization={item.nodeSource as IVisualization}
                section={item.parent as ISection}
            />
        );
    }

    // return (
    // <Stack
    //     overflow="hidden"
    //     width="100%"
    //     height="100%"
    //     direction="column"
    //     spacing={0}
    //     // bg="gray.300"
    //     // p="5px"
    //     alignItems="center"
    //     justifyContent="center"
    // >
    //     <Button
    //         onClick={() => {
    //             if (getIsFullscreen()) {
    //                 exitFullscreen();
    //             } else {
    //                 enterFullscreen(ref.current ? ref.current : undefined);
    //             }
    //         }}
    //         position="fixed"
    //         top="52px"
    //         right={["16px", "16px", "16px", "16px", "16px"]}
    //         zIndex={2}
    //     >
    //         Toggle fullscreen!
    //     </Button>
    //     <Stack ref={ref} flex={1} bg="green" width="100%" h="100%">
    //         {carouselFragment}
    //     </Stack>
    // </Stack>
    // );
}

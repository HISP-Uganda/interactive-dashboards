import { Stack, Button } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React, { useEffect } from "react";
import Slider, { Settings } from "react-slick";
import { useFullScreenHandle, FullScreen } from "react-full-screen";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { dashboardApi, storeApi } from "../../Events";
import { IDashboard, ISection, IVisualization } from "../../interfaces";
import { $presentation, $store } from "../../Store";
import FixedDashboard from "../FixedDashboard";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";

export default function Show3() {
    const presentation = useStore($presentation);
    const handle = useFullScreenHandle();
    const store = useStore($store);
    console.log(presentation.speed);
    const settings: Settings = {
        dots: false,
        infinite: true,
        speed: presentation.speed,
        slidesToShow: 1,
        autoplay: true,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0",
        fade: true,
        pauseOnHover: false,
        easing: "cubic-bezier",
        lazyLoad: "ondemand",
    };

    useEffect(() => {
        const callback = async (event: KeyboardEvent) => {
            if (event.key === "F5" || event.key === "f5") {
                await handle.enter();
                if (handle.active) {
                    storeApi.setIsFullScreen(true);
                } else {
                    storeApi.setIsFullScreen(true);
                }
            }
        };
        document.addEventListener("keydown", callback);
        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, []);
    return (
        <FullScreen handle={handle}>
            <Stack
                p="0"
                m="0"
                spacing="0"
                h={store.isFullScreen ? "100vh" : "calc(100vh - 48px)"}
            >
                {/* <Button position="fixed" top="64px" zIndex={2} left="64px">
                    Full
                </Button> */}
                <Slider {...settings}>
                    {presentation.items.map((item) => {
                        if (item.type === "dashboard") {
                            dashboardApi.setCurrentDashboard(
                                item.nodeSource as IDashboard
                            );
                            return (
                                <Stack
                                    w="100%"
                                    h={
                                        store.isFullScreen
                                            ? "100vh"
                                            : "calc(100vh - 48px)"
                                    }
                                    bg={item.nodeSource?.bg}
                                    p={`${item.nodeSource?.spacing}px`}
                                    key={item.id}
                                >
                                    <FixedDashboard
                                        dashboard={
                                            item.nodeSource as IDashboard
                                        }
                                    />
                                </Stack>
                            );
                        } else if (item.type === "section") {
                            return (
                                <Stack
                                    w="100%"
                                    h={
                                        store.isFullScreen
                                            ? "100vh"
                                            : "calc(100vh - 48px)"
                                    }
                                    bg="gray.300"
                                    key={item.id}
                                >
                                    <SectionVisualization
                                        {...(item.nodeSource as ISection)}
                                    />
                                </Stack>
                            );
                        } else if (item.type === "visualization") {
                            return (
                                <Stack
                                    w="100%"
                                    h={
                                        store.isFullScreen
                                            ? "100vh"
                                            : "calc(100vh - 48px)"
                                    }
                                    bg="gray.300"
                                    key={item.id}
                                >
                                    <Visualization
                                        visualization={
                                            item.nodeSource as IVisualization
                                        }
                                        section={item.parent as ISection}
                                    />
                                </Stack>
                            );
                        }
                        return null;
                    })}
                </Slider>
            </Stack>
        </FullScreen>
    );
}

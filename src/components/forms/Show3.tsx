import React from "react";
import Slider from "react-slick";
import { Button, Stack } from "@chakra-ui/react";
import FixedDashboard from "../FixedDashboard";
import { IDashboard, ISection, IVisualization } from "../../interfaces";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useStore } from "effector-react";
import { $presentation } from "../../Store";
import { dashboardApi } from "../../Events";

export default function Show3() {
    const presentation = useStore($presentation);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        autoplay: true,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0",
    };
    return (
        <Slider
            {...settings}
            arrows={false}
            easing="cubic-bezier"
            lazyLoad="ondemand"
        >
            {presentation.items.map((item) => {
                if (item.type === "dashboard") {
                    dashboardApi.setCurrentDashboard(
                        item.nodeSource as IDashboard
                    );
                    return (
                        <Stack w="100%" h="calc(100vh - 48px)" bg="gray.300">
                            <FixedDashboard
                                dashboard={item.nodeSource as IDashboard}
                            />
                        </Stack>
                    );
                } else if (item.type === "section") {
                    return (
                        <Stack w="100%" h="calc(100vh - 48px)" bg="gray.300">
                            <SectionVisualization
                                {...(item.nodeSource as ISection)}
                            />
                        </Stack>
                    );
                } else if (item.type === "visualization") {
                    return (
                        <Stack w="100%" h="calc(100vh - 48px)" bg="gray.300">
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
    );
}

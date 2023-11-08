import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { ISection } from "../../interfaces";
import Visualization from "./Visualization";
import { Stack } from "@chakra-ui/react";

const Carousel = ({
    section,
    height,
}: {
    section: ISection;
    height: number;
}) => {
    const settings: Settings = {
        dots: false,
        infinite: true,
        speed: 1000,
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
    return (
        <Slider {...settings}>
            {section.visualizations.map((visualization) => (
                <Stack h={`${height}px`} key={visualization.id}>
                    <Visualization
                        key={visualization.id}
                        visualization={visualization}
                        section={section}
                    />
                </Stack>
            ))}
        </Slider>
    );
};

export default Carousel;

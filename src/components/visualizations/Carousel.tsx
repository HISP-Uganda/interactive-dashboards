import { Stack } from "@chakra-ui/react";
import { groupBy } from "lodash";
import { useState } from "react";
import useInterval from "react-useinterval";
import { ISection } from "../../interfaces";
import Visualization from "./Visualization";
import VisualizationTitle from "./VisualizationTitle";

const Carousel = (section: ISection) => {
    const [index, setIndex] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);

    const itemGroups = groupBy(section.visualizations, "group");
    const itemGroupKeys = Object.keys(itemGroups);

    const increment = () => {
        let itemSize = section.visualizations.length;
        if (section.carouselOver === "groups") {
            itemSize = Object.keys(itemGroups).length;
        }
        if (!pause) {
            setIndex((s: number) => (s + 1) % itemSize);
        }
    };
    useInterval(increment, 5000 * 10);
    return (
        <Stack h="100%" key={section.id}>
            {section.carouselOver === "groups" && (
                <VisualizationTitle
                    section={section}
                    fontSize={"18px"}
                    //textTransform={"uppercase"}
                    color={"gray.500"}
                    title={itemGroupKeys[index]}
                    fontWeight="bold"
                />
            )}
            <Stack
                alignItems="center"
                justifyItems="center"
                alignContent="center"
                justifyContent={section.justifyContent || "space-around"}
                direction={section.direction}
                flex={1}
            >
                {section.carouselOver === "groups" ? (
                    itemGroups[itemGroupKeys[index]].map((visualization) => (
                        <Visualization
                            key={visualization.id}
                            visualization={visualization}
                            section={section}
                        />
                    ))
                ) : (
                    <Visualization
                        key={section.visualizations[index].id}
                        visualization={section.visualizations[index]}
                        section={section}
                    />
                )}
            </Stack>
        </Stack>
    );
};

export default Carousel;

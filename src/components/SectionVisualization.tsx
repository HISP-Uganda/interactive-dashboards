import { Box, SimpleGrid, Stack, Image } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import Marquee from "react-fast-marquee";
import { setCurrentSection } from "../Events";
import { FormGenerics, ISection } from "../interfaces";
import { $dashboard, $store } from "../Store";
import Carousel from "./visualizations/Carousel";
import TabPanelVisualization from "./visualizations/TabPanelVisualization";
import Visualization from "./visualizations/Visualization";
import VisualizationTitle from "./visualizations/VisualizationTitle";
import { useElementSize } from "usehooks-ts";

const SectionVisualization = (section: ISection) => {
  const search = useSearch<FormGenerics>();
  const [squareRef, { width, height }] = useElementSize();
  const store = useStore($store);
  const navigate = useNavigate();
  const dashboard = useStore($dashboard);

  const displays = {
    carousel: <Carousel {...section} />,
    marquee: (
      <Stack
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        justifyItems="center"
        w="100%"
        h="100%"
        onClick={(e: MouseEvent<HTMLElement>) => {
          if (e.detail === 2 && store.isAdmin) {
            setCurrentSection(section);
            navigate({
              to: `/dashboards/${dashboard.id}/section`,
              search,
            });
          }
        }}
      >
        <Marquee
          style={{ padding: 0, margin: 0, fontFamily: "sans-serif" }}
          gradient={false}
          speed={30}
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
    ),
    grid: (
      <Stack h="100%" w="100%">
        {section.title && (
          <VisualizationTitle
            section={section}
            fontSize={"18px"}
            textTransform={"uppercase"}
            color={"gray.500"}
            title={section.title}
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
          w="100%"
          h="100%"
        >
          <SimpleGrid
            columns={2}
            h="100%"
            justifyContent="space-around"
            alignContent="space-around"
          >
            {section.visualizations.map((visualization) => (
              <Visualization
                key={visualization.id}
                visualization={visualization}
                section={section}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    ),
    normal: (
      <Stack h="100%" w="100%">
        {section.title && (
          <VisualizationTitle
            section={section}
            fontSize={"18px"}
            textTransform={"uppercase"}
            color={"gray.500"}
            title={section.title}
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
          w="100%"
          h="100%"
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
  if (section.images && section.images.length > 0) {
    return (
      <Stack direction="row" h="100%" w="100%" bg="yellow.200" ref={squareRef}>
        {/* <Image src={section.images[0].src} maxH={height} /> */}
      </Stack>
    );
  }
  return displays[section.display] || displays.normal;
};

export default SectionVisualization;

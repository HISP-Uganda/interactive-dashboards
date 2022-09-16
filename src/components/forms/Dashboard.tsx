import {
  Box,
  Grid,
  GridItem,
  Stack,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { MouseEvent } from "react";

import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import Marquee from "react-fast-marquee";
import { setCurrentSection } from "../../Events";
import { FormGenerics, ISection } from "../../interfaces";
import { $dashboard, $store } from "../../Store";
import Carousel from "../visualizations/Carousel";
import Visualization from "../visualizations/Visualization";
import VisualizationTitle from "../visualizations/VisualizationTitle";

const Dashboard = () => {
  const search = useSearch<FormGenerics>();
  const navigate = useNavigate();
  const store = useStore($store);
  const dashboard = useStore($dashboard);

  const templateColumns = useBreakpointValue({
    base: "100%",
    md: `repeat(${dashboard.columns}, 1fr)`,
  });
  const templateRows = useBreakpointValue({
    base: "100%",
    md: `repeat(${dashboard.rows}, 1fr)`,
  });
  return (
    <Grid
      templateColumns={templateColumns}
      templateRows={templateRows}
      gap={1}
      h="100%"
    >
      {dashboard?.sections.map((section: ISection) => (
        <GridItem
          bg="white"
          h="100%"
          key={section.id}
          colSpan={section.colSpan}
          rowSpan={section.rowSpan}
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
          {section.display === "carousel" ? (
            <Carousel {...section} />
          ) : section.display === "marquee" ? (
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
                style={{ padding: 0, margin: 0 }}
                gradient={false}
                speed={40}
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
          ) : (
            <Stack h="100%">
              {section.title && (
                <VisualizationTitle section={section} fontSize={"18px"} textTransform={"uppercase"} color={"gray.500"} title={section.title} fontWeight="bold"/>
              )}
              <Stack
                justifyContent={section.justifyContent || "space-around"}
                direction={section.direction}
                flex={1}
                p="5px"
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
          )}
        </GridItem>
      ))}
    </Grid>
  );
};

export default Dashboard;

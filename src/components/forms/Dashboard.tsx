import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import { setCurrentSection } from "../../Events";
import { ISection, LocationGenerics } from "../../interfaces";
import { $dashboard, $dimensions, $store } from "../../Store";
import SectionVisualization from "../SectionVisualization";

const Dashboard = () => {
  const search = useSearch<LocationGenerics>();
  const navigate = useNavigate();
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  const { isNotDesktop } = useStore($dimensions);

  const templateColumns = useBreakpointValue({
    base: "auto",
    sm: "auto",
    md: "auto",
    lg: `repeat(${dashboard.columns}, 1fr)`,
  });
  const templateRows = useBreakpointValue({
    base: "auto",
    sm: "auto",
    md: "auto",
    lg: `repeat(${dashboard.rows}, 1fr)`,
  });
  return (
    <Grid
      templateColumns={templateColumns}
      templateRows={templateRows}
      gap="5px"
      h="100%"
      w="100%"
    >
      {dashboard?.sections.map((section: ISection) => (
        <GridItem
          bgColor="white"
          key={section.id}
          colSpan={{ lg: section.colSpan, md: 1 }}
          rowSpan={{ lg: section.rowSpan, md: 1 }}
          h={isNotDesktop ? (section.height ? section.height : "15vh") : "100%"}
          maxH={
            isNotDesktop ? (section.height ? section.height : "15vh") : "100%"
          }
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
          <SectionVisualization {...section} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default Dashboard;

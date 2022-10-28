import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { MouseEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { setCurrentSection } from "../../Events";
import { FormGenerics, ISection } from "../../interfaces";
import { $dashboard, $store } from "../../Store";
import SectionVisualization from "../SectionVisualization";

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
      gap="5px"
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
          <SectionVisualization {...section} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default Dashboard;

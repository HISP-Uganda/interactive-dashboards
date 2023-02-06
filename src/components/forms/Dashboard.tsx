import { Grid, GridItem, useBreakpointValue, Text } from "@chakra-ui/react";
import { useRef, DragEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import SpringList from "react-spring-dnd";
import { setCurrentSection, setSections } from "../../Events";
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
  const dragItem = useRef<number | undefined | null>();
  const dragOverItem = useRef<number | null>();
  const dragStart = (e: DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    console.log(position);
  };

  const dragEnter = (e: DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    console.log(position);
  };

  const drop = (e: DragEvent<HTMLDivElement>) => {
    const copyListItems = [...dashboard.sections];
    if (
      dragItem.current !== null &&
      dragItem.current !== undefined &&
      dragOverItem.current !== null &&
      dragOverItem.current !== undefined
    ) {
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setSections(copyListItems);
    }
  };
  return (
    <Grid
      templateColumns={templateColumns}
      templateRows={templateRows}
      gap="5px"
      h="100%"
      w="100%"
    >
      {dashboard?.sections.map((section: ISection, index: number) => (
        <GridItem
          draggable
          onDragStart={(e) => dragStart(e, index)}
          onDragEnter={(e) => dragEnter(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={drop}
          bgColor={section.bg}
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

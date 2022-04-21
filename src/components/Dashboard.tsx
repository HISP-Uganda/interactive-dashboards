import {
  Box,
  Button,
  Icon,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useMatch, useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useCallback, useEffect } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { MdDashboard } from "react-icons/md";
import "react-resizable/css/styles.css";
import {
  addSection,
  changeLayouts,
  deleteSection,
  increment,
  setCurrentSection,
  setCurrentVisualization,
  toggle,
  toggleDashboard,
} from "../Events";
import { ISection, IVisualization } from "../interfaces";
import { $dashboard, $section, createSection } from "../Store";
import { generateUid } from "../utils/uid";
import Visualization from "./visualizations/Visualization";
const ReactGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const navigate = useNavigate();
  const engine = useDataEngine();
  const updateDashboard = async (data: any) => {
    const mutation: any = {
      type: "update",
      resource: `dataStore/i-dashboards`,
      data: data,
      id: data.id,
    };
    await engine.mutate(mutation);
  };

  // const { isLoading, isSuccess, isError, data, error } = useNamespaceKey(
  //   "i-dashboards",
  //   id
  // );

  const add = (visualization: IVisualization) => {
    setCurrentVisualization(visualization);
  };
  const dashboard = useStore($dashboard);
  const currentSection = useStore($section);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      toggle();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [escFunction]);
  return (
    <Stack spacing="0">
      {dashboard.showTop && (
        <Stack
          bg="yellow.100"
          direction="row"
          alignContent="center"
          alignItems="center"
          h="48px"
          pr="5px"
        >
          {dashboard.mode === "edit" && (
            <>
              <Button
                type="button"
                onClick={() => navigate({ to: "/dashboards/section" })}
              >
                Add section
              </Button>
              <Button type="button" onClick={() => increment(1)}>
                Increase
              </Button>
              <Button type="button" onClick={() => increment(-1)}>
                Reduce
              </Button>
              {/* <Button
                isDisabled={!currentSection}
                onClick={() =>
                  add({
                    id: generateUid(),
                    type: "",
                    indicators: [],
                  })
                }
              >
                Add Visualization
              </Button> */}
              {dashboard?.published && (
                <Button onClick={() => toggleDashboard(false)}>Edit</Button>
              )}
              {!dashboard?.published && (
                <Button onClick={() => toggleDashboard(true)}>Publish</Button>
              )}
              <Button type="button" onClick={() => updateDashboard(dashboard)}>
                Save Dashboard
              </Button>
            </>
          )}
          <Spacer />
          <Button onClick={() => toggle()}>Toggle</Button>
        </Stack>
      )}
      <Stack
        h={`calc(100vh - ${dashboard.showTop ? 96 : 48}px)`}
        w={`calc(100vw - ${dashboard.showSider ? 48 : 0}px)`}
        overflow="auto"
        bg="gray.200"
      >
        <ReactGridLayout
          margin={[5, 5]}
          layouts={dashboard.layouts}
          verticalCompact={true}
          onLayoutChange={(currentLayout: Layout[], allLayouts: Layouts) =>
            changeLayouts({ currentLayout, allLayouts })
          }
          autoSize={true}
          preventCollision={false}
          containerPadding={[5, 5]}
          rowHeight={dashboard.itemHeight}
          isResizable={dashboard.mode === "edit"}
        >
          {dashboard?.sections.map((section: ISection) => (
            <Stack
              onClick={() => {
                if (dashboard.mode === "edit") {
                  setCurrentSection(section);
                }
              }}
              border={
                currentSection?.i === section.i ? "red 1px solid" : "none"
              }
              key={section.i}
              data-grid={section}
              spacing="2px"
              bg="white"
            >
              <Stack
                direction="row"
                bg="gray.500"
                h="30px"
                fontSize="24px"
                alignContent="center"
                alignItems="center"
              >
                <Text>{section.title}</Text>
                <Spacer />
                {section?.i === section.i && dashboard.mode === "edit" && (
                  <Button
                    colorScheme="red"
                    size="xs"
                    onClick={() => deleteSection(section.i)}
                  >
                    X
                  </Button>
                )}
              </Stack>
              <Stack flex={1}>
                {section.visualizations.map((visualization) => (
                  <Visualization
                    key={visualization.id}
                    visualization={visualization}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </ReactGridLayout>
      </Stack>
    </Stack>
    // <NewVisualizationDialog isOpen={isOpen} onClose={onClose} />
  );
};

export default Dashboard;

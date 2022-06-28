import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { DatePicker } from "antd";
import { useStore } from "effector-react";
import { useCallback, useEffect } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  changeLayouts,
  increment,
  setCurrentSection,
  setShowSider,
  toggle,
  toggleDashboard,
} from "../../Events";
import { FormGenerics, ISection } from "../../interfaces";
import { $dashboard, $store, createSection } from "../../Store";
import OrganizationUnitTree from "../filters/OrganizationUnitTree";
import Visualization from "../visualizations/Visualization";


const { RangePicker } = DatePicker;
const ReactGridLayout = WidthProvider(Responsive);
const Dashboard = () => {
  const search = useSearch<FormGenerics>();
  const navigate = useNavigate();
  const engine = useDataEngine();
  const updateDashboard = async (data: any) => {
    let mutation: any = {
      type: "create",
      resource: `dataStore/i-dashboards/${data.id}`,
      data,
    };
    if (search.edit) {
      mutation = {
        type: "update",
        resource: `dataStore/i-dashboards`,
        data: data,
        id: data.id,
      };
    }
    await engine.mutate(mutation);
  };
  const store = useStore($store);
  const dashboard = useStore($dashboard);
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

  useEffect(() => {
    setShowSider(false);
  }, []);
  return (
    <Stack spacing="0">
      {dashboard.showTop && (
        <Stack
          direction="row"
          alignContent="center"
          alignItems="center"
          h="48px"
          p="5px"
        >
          {dashboard.mode === "edit" && (
            <>
              <Button
                type="button"
                onClick={() => {
                  setCurrentSection(createSection());
                  navigate({ to: "/dashboards/section", search });
                }}
              >
                Add section
              </Button>
              <Button type="button" onClick={() => increment(1)}>
                Increase
              </Button>
              <Button type="button" onClick={() => increment(-1)}>
                Reduce
              </Button>
              {dashboard?.published && (
                <Button onClick={() => toggleDashboard(false)}>Edit</Button>
              )}
              {!dashboard?.published && (
                <Button onClick={() => toggleDashboard(true)}>Publish</Button>
              )}
            </>
          )}
          <Spacer />
          <RangePicker
            style={{ height: "40px" }}
            // value={}
            // onChange={}
          />
          <OrganizationUnitTree />
          <Button colorScheme="teal" type="button" onClick={() => updateDashboard(dashboard)}>
            Save Dashboard
          </Button>
          <Button colorScheme="blue" onClick={() => toggle()}>Toggle</Button>
        </Stack>
      )}
      <Stack
        h={`calc(100vh - ${dashboard.showTop ? 96 : 48}px)`}
        w={`calc(100vw - ${store.showSider ? 128 : 0}px)`}
        overflow="auto"
        bg="gray.50"
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
              key={section.i}
              data-grid={section}
              spacing="2px"
              bg="white"
            >
              <Stack
                direction="row"
                bg="gray.200"
                h="30px"
                fontSize="24px"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                justifyItems="center"
                textAlign="center"
              >
                <Menu>
                  <MenuButton
                    _hover={{ bg: "none" }}
                    bg="none"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {section.title}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setCurrentSection(section);
                        navigate({ to: "/dashboards/section" });
                      }}
                    >
                      Edit
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
              <Stack flex={1} direction="row">
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

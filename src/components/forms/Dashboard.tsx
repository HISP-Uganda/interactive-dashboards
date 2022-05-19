import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
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
import { useStore } from "effector-react";
import { useCallback, useEffect } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  changeLayouts,
  changeOrganisations,
  increment,
  setCurrentSection,
  setShowSider,
  toggle,
  toggleDashboard,
} from "../../Events";
import { FormGenerics, ISection } from "../../interfaces";
import {
  $dashboard,
  $expandedKeys,
  $organisations,
  $store,
  createSection,
} from "../../Store";
import AutoRefreshPicker from "../AutoRefreshPicker";
import DashboardFilter from "../filters/DashboardFilter";
import OrgUnitTree from "../OrgUnitTree";
import PeriodPicker from "../PeriodPicker";
import Visualization from "../visualizations/Visualization";
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
  const organisations = useStore($organisations);
  const expandedKeys = useStore($expandedKeys);
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
          <DashboardFilter />
          {dashboard.mode === "edit" && (
            <>
              <Button
                size="sm"
                type="button"
                onClick={() => {
                  setCurrentSection(createSection());
                  navigate({ to: "/dashboards/section", search });
                }}
              >
                Add section
              </Button>
              {/* <Button size="sm" type="button" onClick={() => increment(1)}>
                Increase
              </Button>
              <Button size="sm" type="button" onClick={() => increment(-1)}>
                Reduce
              </Button>
              {dashboard?.published && (
                <Button size="sm" onClick={() => toggleDashboard(false)}>
                  Edit
                </Button>
              )}
              {!dashboard?.published && (
                <Button size="sm" onClick={() => toggleDashboard(true)}>
                  Publish
                </Button>
              )} */}
            </>
          )}
          <Spacer />
          <Box w="200px">
            <OrgUnitTree
              expandedKeys={expandedKeys}
              initial={organisations}
              value={store.selectedOrganisation}
              onChange={(value) => changeOrganisations(value)}
            />
          </Box>
          <PeriodPicker />
          {dashboard.mode === "edit" && (
            <Button
              size="sm"
              type="button"
              onClick={() => updateDashboard(dashboard)}
            >
              Save
            </Button>
          )}
          <AutoRefreshPicker />
          {/* <Button  size='sm' onClick={() => toggle()}>Toggle</Button> */}
        </Stack>
      )}
      <Stack
        h={`calc(100vh - ${dashboard.showTop ? 96 : 48}px)`}
        w="100vw"
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
              <Stack direction={section.direction} w="100%" h="100%">
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
  );
};

export default Dashboard;

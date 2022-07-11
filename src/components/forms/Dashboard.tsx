import { ChangeEvent } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { Textfit } from "react-textfit";
import { GroupBase, Select } from "chakra-react-select";

import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { DatePicker } from "antd";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  changeCategory,
  changeDashboardDescription,
  changeDashboardName,
  changeLayouts,
  changePeriods,
  changeSelectedCategory,
  changeSelectedDashboard,
  increment,
  setCurrentDashboard,
  setCurrentSection,
  setDashboards,
  setShowSider,
  toggleDashboard,
} from "../../Events";
import {
  FormGenerics,
  IDashboard,
  ISection,
  Item,
  Option,
} from "../../interfaces";
import {
  $categories,
  $categoryOptions,
  $dashboard,
  $dashboards,
  $store,
  createSection,
} from "../../Store";
import AutoRefreshPicker from "../AutoRefreshPicker";
import DashboardFilter from "../filters/DashboardFilter";
import OUTree from "../OUTreeSelect";
import PeriodPicker from "../PeriodPicker";
import Visualization from "../visualizations/Visualization";

const ReactGridLayout = WidthProvider(Responsive);
const Dashboard = () => {
  const search = useSearch<FormGenerics>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const engine = useDataEngine();
  const dashboards = useStore($dashboards);
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
    onClose();
  };

  const togglePublish = async (data: IDashboard, value: boolean) => {
    let mutation: any = {
      type: "update",
      resource: `dataStore/i-dashboards`,
      data: { ...data, published: true },
      id: data.id,
    };
    await engine.mutate(mutation);
    setDashboards(
      dashboards.map((d) => {
        if (data.id === d.id) {
          return { ...d, published: value };
        }
        return d;
      })
    );
    setCurrentDashboard({ ...data, published: value });
  };
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  const categoryOptions = useStore($categoryOptions);
  const onChangePeriods = (periods: Item[]) => {
    changePeriods(periods);
  };
  useEffect(() => {
    setShowSider(false);
    // changeSelectedDashboard(dashboard.id);
    // changeSelectedCategory(dashboard.category || "");
  }, []);
  // useEffect(() => {
  //   const search = dashboards.find((d) => d.id === store.selectedDashboard);
  //   if (search) {
  //     setCurrentDashboard(search);
  //   }
  // }, [store.selectedDashboard]);
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

          <Button size="sm" type="button" onClick={() => increment(1)}>
            +
          </Button>
          <Button size="sm" type="button" onClick={() => increment(-1)}>
            -
          </Button>
          <Button
            size="sm"
            type="button"
            colorScheme="blue"
            onClick={() => {
              navigate({ to: "/dashboards" });
            }}
          >
            Dashboard List
          </Button>
          <Spacer />
          <Text>Filter</Text>
          {store.isAdmin && (
            <>
              <Button
                size="sm"
                type="button"
                onClick={() => {
                  setCurrentSection(createSection());
                  navigate({
                    to: `/dashboards/${dashboard.id}/section`,
                    search,
                  });
                }}
              >
                Add section
              </Button>
              <Button size="sm" type="button" onClick={onOpen}>
                Save
              </Button>
              {dashboard.published && (
                <Button
                  size="sm"
                  onClick={() => togglePublish(dashboard, false)}
                >
                  Unpublish
                </Button>
              )}
              {!dashboard.published && (
                <Button
                  size="sm"
                  onClick={() => togglePublish(dashboard, true)}
                >
                  Publish
                </Button>
              )}
            </>
          )}
          <OUTree />
          <PeriodPicker
            selectedPeriods={store.periods}
            onChange={onChangePeriods}
          />
          <AutoRefreshPicker />
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
                {/* <Menu>
                  <MenuButton
                    _hover={{ bg: "none" }}
                    bg="none"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {section.title}
                    {section.i}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setCurrentSection(section);
                        navigate({ to: `/dashboards/${dashboard.id}/section` });
                      }}
                    >
                      Edit
                    </MenuItem>
                  </MenuList>
                </Menu> */}
                <Textfit mode="single">Fat headline!</Textfit>
              </Stack>
              <Stack
                direction={section.direction}
                w="100%"
                h="100%"
                justifyContent="space-between"
                // justifyItems="center"
                // alignContent="center"
                // alignSelf="center"
                // alignItems="center"
              >
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

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dashboard Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="20px">
              <Stack>
                <Text>Category</Text>
                <Select<Option, false, GroupBase<Option>>
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (d: Option) => d.value === dashboard.category
                  )}
                  onChange={(e) => changeCategory(e?.value || "")}
                />
              </Stack>
              <Stack>
                <Text>Name</Text>
                <Input
                  value={dashboard.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    changeDashboardName(e.target.value)
                  }
                />
              </Stack>
              <Stack>
                <Text>Description</Text>
                <Textarea
                  value={dashboard.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    changeDashboardDescription(e.target.value)
                  }
                />
              </Stack>
              {/* <Stack>
                <Checkbox value={}>Default Dashboard</Checkbox>
              </Stack> */}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => updateDashboard(dashboard)}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Dashboard;

import { EditIcon, ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import { MouseEvent } from "react";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineNumber,
} from "react-icons/ai";
import { FaGlobeAfrica } from "react-icons/fa";
import {
  Box,
  Button,
  IconButton,
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
  Textarea,
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import Marquee from "react-fast-marquee";

import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  changeCategory,
  changeDashboardDescription,
  changeDashboardName,
  changeLayouts,
  changePeriods,
  changeVisualizationType,
  increment,
  setCurrentDashboard,
  setCurrentPage,
  setCurrentSection,
  setDashboards,
  setDefaultDashboard,
  setShowSider,
} from "../../Events";
import {
  FormGenerics,
  IDashboard,
  ISection,
  Item,
  Option,
} from "../../interfaces";
import {
  $categoryOptions,
  $dashboard,
  $dashboards,
  $store,
  createSection,
} from "../../Store";
import AutoRefreshPicker from "../AutoRefreshPicker";
import DashboardFilter from "../filters/DashboardFilter";
import OUTreeSelect from "../OUTreeSelect";
import PeriodPicker from "../PeriodPicker";
import Visualization from "../visualizations/Visualization";
import Carousel from "../visualizations/Carousel";

const ReactGridLayout = WidthProvider(Responsive);
const Dashboard = () => {
  const search = useSearch<FormGenerics>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isFull, onOpen: onFull, onClose: onUnFull } = useDisclosure();
  const [section, setSection] = useState<ISection | undefined>();
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
    const mutation2: any = {
      type: "update",
      resource: `dataStore/i-dashboard-settings`,
      data: { default: store.defaultDashboard },
      id: "settings",
    };
    await Promise.all([engine.mutate(mutation), engine.mutate(mutation2)]);
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

  const displayFull = (section: string) => {
    setSection(dashboard.sections.find((sec) => sec.i === section));
    onFull();
  };
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
          <Button size="sm" type="button" onClick={() => increment(1)}>
            +
          </Button>
          <Button size="sm" type="button" onClick={() => increment(-1)}>
            -
          </Button>

          {/* <DashboardFilter /> */}
          {store.isAdmin && (
            <Button
              size="sm"
              type="button"
              colorScheme="blue"
              onClick={() => {
                navigate({ to: "/dashboards" });
                setCurrentPage("");
              }}
            >
              Manage Dashboards
            </Button>
          )}
          <Spacer />
          <Text fontSize="lg">Filter</Text>
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
          <OUTreeSelect />
          <PeriodPicker
            selectedPeriods={store.periods}
            onChange={onChangePeriods}
          />
          {store.isAdmin && <AutoRefreshPicker />}
        </Stack>
      )}
      <Stack
        h={`calc(100vh - ${dashboard.showTop ? 96 : 48}px)`}
        overflow="auto"
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
          isResizable={store.isAdmin}
          isDraggable={store.isAdmin}
          isDroppable={store.isAdmin}
          cols={{ md: 24, lg: 24, xl: 24, sm: 6 }}
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
              {section.title && (
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
                  _focus={{ boxShadow: "none !important" }}
                >
                  <Text
                    pl="25px"
                    h="20px"
                    textTransform="uppercase"
                    fontWeight="bold"
                    fontSize="0.8vw"
                    color="gray.500"
                    noOfLines={1}
                  >
                    {section.title}
                  </Text>
                  <Spacer />
                  <Menu placement="left-start">
                    <MenuButton
                      _hover={{ bg: "none" }}
                      _expanded={{ bg: "none" }}
                      _focus={{ boxShadow: "none" }}
                      bg="none"
                      as={IconButton}
                      icon={<HamburgerIcon />}
                    />
                    <MenuList>
                      {store.isAdmin && (
                        <MenuItem
                          maxH="32px"
                          fontSize="18px"
                          onClick={() => {
                            setCurrentSection(section);
                            navigate({
                              to: `/dashboards/${dashboard.id}/section`,
                              search,
                            });
                          }}
                          icon={<EditIcon />}
                        >
                          Edit
                        </MenuItem>
                      )}
                      <MenuItem
                        maxH="32px"
                        fontSize="18px"
                        onClick={() => displayFull(section.i)}
                        icon={<ExternalLinkIcon />}
                      >
                        Expand
                      </MenuItem>

                      <MenuItem
                        maxH="32px"
                        fontSize="18px"
                        onClick={() =>
                          changeVisualizationType({
                            section,
                            visualization: "line",
                          })
                        }
                        icon={<AiOutlineLineChart />}
                      >
                        View as Line
                      </MenuItem>
                      <MenuItem
                        maxH="32px"
                        fontSize="18px"
                        onClick={() =>
                          changeVisualizationType({
                            section,
                            visualization: "bar",
                          })
                        }
                        icon={<AiOutlineBarChart />}
                      >
                        View as Column
                      </MenuItem>
                      <MenuItem
                        maxH="32px"
                        fontSize="18px"
                        onClick={() =>
                          changeVisualizationType({
                            section,
                            visualization: "map",
                          })
                        }
                        icon={<FaGlobeAfrica />}
                      >
                        View as Map
                      </MenuItem>
                      <MenuItem
                        maxH="32px"
                        fontSize="18px"
                        onClick={() =>
                          changeVisualizationType({
                            section,
                            visualization: "single",
                          })
                        }
                        icon={<AiOutlineNumber />}
                      >
                        View as Single Value
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Stack>
              )}

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
                          key={visualization.id}
                          visualization={visualization}
                        />
                        <Box w="70px">&nbsp;</Box>
                      </Stack>
                    ))}
                  </Marquee>
                </Stack>
              ) : (
                <Stack
                  direction={section.direction}
                  spacing="40px"
                  // alignItems="center"
                  // alignContent="center"
                  // justifyContent="center"
                  // justifyItems="center"
                  // overflow="auto"
                  alignItems="space-between"
                  alignContent="space-between"
                  w="100%"
                  h="100%"
                >
                  {section.visualizations.map((visualization) => (
                    <Visualization
                      key={visualization.id}
                      visualization={visualization}
                    />
                  ))}
                </Stack>
              )}
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
              <Stack>
                <Checkbox
                  isChecked={store.defaultDashboard === dashboard.id}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDefaultDashboard(e.target.checked ? dashboard.id : "")
                  }
                >
                  Default Dashboard
                </Checkbox>
              </Stack>
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

      <Modal isOpen={isFull} onClose={onUnFull} size="full">
        <ModalOverlay />
        <ModalContent h="100vh" display="flex" flexDirection="column" w="100vw">
          <ModalBody>
            <Stack h="100%" w="100%" direction={section?.direction}>
              {section?.visualizations.map((visualization) => (
                <Visualization
                  key={visualization.id}
                  visualization={visualization}
                />
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Dashboard;

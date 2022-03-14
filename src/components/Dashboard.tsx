import { useState } from "react";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  SimpleGrid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { fromPairs, maxBy } from "lodash";
import {
  ItemCallback,
  Layout,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useMatch } from "react-location";
import "react-resizable/css/styles.css";
import {
  activateSection,
  addDashboard,
  addSection,
  deleteSection,
} from "../Events";
import { ISection } from "../interfaces";
import { useNamespaceKey } from "../Queries";
import { $layout, $store } from "../Store";
const ReactGridLayout = WidthProvider(Responsive);
const visualizationTypes = [
  { name: "Single Value", id: "1", description: "Single Value Visualization" },
  { name: "Bar Graph", id: "2", description: "Bar Graph Visualization" },
  { name: "Map", id: "3", description: "Map Visualization" },
  { name: "Pie Chart", id: "4", description: "Pie Chart Visualization" },
  {
    name: "Stacked Column",
    id: "5",
    description: "Stacked Column Visualization",
  },
  { name: "Column", id: "6", description: "Column Visualization" },
  { name: "Stacked Bar", id: "7", description: "Stacked Bar Visualization" },
  { name: "Line Graph", id: "8", description: "Line Graph Visualization" },
];
const Dashboard = () => {
  const [isDesktop] = useMediaQuery("(min-width: 1024px)");
  const [isTablet] = useMediaQuery("(min-width: 768px)");
  const [isPhone] = useMediaQuery("(min-width: 360px)");
  const engine = useDataEngine();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rowHeight, setRowHeight] = useState<number>(100);
  const store = useStore($store);
  const updateDashboard = async () => {
    const mutation: any = {
      type: "update",
      resource: `dataStore/i-dashboards`,
      data: store.dashboard,
      id: store.dashboard.id,
    };
    await engine.mutate(mutation);
  };
  const {
    params: { id },
  } = useMatch();

  const itemCallback: ItemCallback = (layout: Layout[]) => {
    const layouts = fromPairs(layout.map((l: Layout) => [l.i, l]));
    const allSections = store.dashboard.sections.map((section: ISection) => {
      return { ...section, layout: { md: layouts[section.id] } };
    });
    addDashboard({ ...store.dashboard, sections: allSections });
  };

  const { isLoading, isSuccess, isError, data, error } = useNamespaceKey(
    "i-dashboards",
    id
  );
  const autoFit = () => {
    const layout = store.dashboard.sections.map((section) => section.layout.md);
    const maxCoordinate = maxBy(layout, "y");
    if (maxCoordinate) {
      const height = (maxCoordinate.h + maxCoordinate.y) * rowHeight;
      const availableHeight = window.innerHeight - 96;
      const difference =
        (height - availableHeight) / (maxCoordinate.h + maxCoordinate.y);
      // console.log(difference, height - availableHeight);
      setRowHeight(rowHeight - difference);
    }
  };
  const layout = useStore($layout);
  // useEffect(() => {}, [isDesktop, isTablet, isPhone]);
  return (
    <Stack h="calc(100vh - 48px)">
      <Stack direction="row" h="48px" pt="4px">
        <Button type="button" onClick={() => addSection()}>
          Add section
        </Button>
        <Button type="button" onClick={() => addSection()}>
          Delete section
        </Button>
        <Button type="button" onClick={() => updateDashboard()}>
          Save Dashboard
        </Button>
        <Button type="button" onClick={() => autoFit()}>
          Auto Fit
        </Button>
        <Button onClick={onOpen}>Add Visualization</Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && data && (
        <Box h="calc(100vh - 96px)" overflow="auto">
          <ReactGridLayout
            margin={[5, 5]}
            layouts={layout}
            onDragStop={itemCallback}
            verticalCompact={true}
            autoSize={true}
            preventCollision={false}
            onResizeStop={itemCallback}
            rowHeight={rowHeight}
          >
            {store.dashboard.sections.map((section: ISection) => (
              <Stack
                onClick={() => activateSection(section.id)}
                border={store.section === section.id ? "red 1px solid" : "none"}
                key={section.id}
                data-grid={section.layout.md}
              >
                <Stack direction="row">
                  <Editable defaultValue={section.name}>
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                  <Spacer />
                  {store.section === section.id ? (
                    <Button
                      colorScheme="red"
                      size="xs"
                      onClick={() => deleteSection(section.id)}
                    >
                      X
                    </Button>
                  ) : null}
                </Stack>
                <Box>{section.layout.md.w}</Box>
              </Stack>
            ))}
          </ReactGridLayout>
        </Box>
      )}
      {isError && <Box>{error.message}</Box>}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adding Visualization</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="100%">
            <Stack direction="row" h="600px">
              <Stack w="70%">
                <Stack h="60%">
                  <Text>Visualization</Text>
                </Stack>
                <Stack></Stack>
              </Stack>
              <Stack flex={1}>
                <Stack h="60%" overflow="auto">
                  <SimpleGrid
                    columns={2}
                    spacing="5px"
                    minChildWidth="140px"
                    textAlign="center"
                    alignItems={"center"}
                    justifyContent="center"
                  >
                    {visualizationTypes.map((v) => (
                      <Flex
                        key={v.id}
                        alignItems="center"
                        justifyContent="center"
                        h="100px"
                      >
                        {v.name}
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Stack>
                <Stack>
                  <Text>Right</Text>
                </Stack>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Dashboard;

import { useEffect } from "react";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Spacer,
  Spinner,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import {
  ItemCallback,
  Layout,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useMatch } from "react-location";
import "react-resizable/css/styles.css";
import { activateSection, addDashboard, addSection } from "../Events";
import { ISection } from "../interfaces";
import { useNamespaceKey } from "../Queries";
import { $layout, $store } from "../Store";
const ReactGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isDesktop] = useMediaQuery("(min-width: 1024px)");
  const [isTablet] = useMediaQuery("(min-width: 768px)");
  const [isPhone] = useMediaQuery("(min-width: 360px)");
  const engine = useDataEngine();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const layout = useStore($layout);
  // useEffect(() => {}, [isDesktop, isTablet, isPhone]);

  return (
    <Stack>
      <Stack direction="row">
        <Button type="button" onClick={() => addSection()}>
          Add section
        </Button>
        <Button type="button" onClick={() => addSection()}>
          Delete section
        </Button>
        <Button type="button" onClick={() => updateDashboard()}>
          Save Dashboard
        </Button>
        <Button onClick={onOpen}>Add Visualization</Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && data && (
        <Box>
          <ReactGridLayout
            margin={[5, 5]}
            layouts={layout}
            onDragStop={itemCallback}
            verticalCompact={true}
            autoSize={true}
            preventCollision={false}
            onResizeStop={itemCallback}
            rowHeight={78}
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
                  <Button colorScheme="red" size="xs">
                    X
                  </Button>
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
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="100%">
            <Stack h="100%">
              <Stack flex={1} h="100%" bg="green.100" direction="row">
                <Stack bg="green.800" w="70%">
                  <Text>Right</Text>
                </Stack>
                <Stack bg="green.900" flex={1}>
                  <Text>Right</Text>
                </Stack>
              </Stack>
              <Stack bg="green.600" h="300px">
                <Text>Right</Text>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Dashboard;

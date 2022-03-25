import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Spacer,
  Spinner,
  Stack,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { useState } from "react";
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
  setCurrentSection,
  setCurrentDashboard,
  addSection,
  setCurrentVisualization,
  deleteSection,
  toggleDashboard,
} from "../Events";
import { ISection, IVisualization } from "../interfaces";
import { useNamespaceKey } from "../Queries";
import { $layout, $store } from "../Store";
import { generateUid } from "../utils/uid";
import NewVisualizationDialog from "./dialogs/NewVisualizationDialog";
const ReactGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isDesktop] = useMediaQuery("(min-width: 1024px)");
  const [isTablet] = useMediaQuery("(min-width: 768px)");
  const [isPhone] = useMediaQuery("(min-width: 360px)");
  const engine = useDataEngine();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rowHeight, setRowHeight] = useState<number>(100);
  const store = useStore($store);
  const updateDashboard = async (data: any) => {
    const mutation: any = {
      type: "update",
      resource: `dataStore/i-dashboards`,
      data: data,
      id: data.id,
    };
    await engine.mutate(mutation);
  };
  const {
    params: { id },
  } = useMatch();

  const itemCallback: ItemCallback = (layout: Layout[]) => {
    const layouts = fromPairs(layout.map((l: Layout) => [l.i, l]));
    const allSections = store.dashboard?.sections.map((section: ISection) => {
      return { ...section, layout: { md: layouts[section.id] } };
    });

    if (store.dashboard) {
      setCurrentDashboard({ ...store.dashboard, sections: allSections });
    }
  };

  const { isLoading, isSuccess, isError, data, error } = useNamespaceKey(
    "i-dashboards",
    id
  );

  const increment = (value: number) => {
    setRowHeight(rowHeight + value);
  };
  const layout = useStore($layout);

  const fitPage = () => {
    const allLayouts = store.dashboard?.sections.map(
      (section) => section.layout.md
    );
  };

  const add = (visualization: IVisualization) => {
    setCurrentVisualization(visualization);
    onOpen();
  };

  return (
    <Stack h="calc(100vh - 48px)">
      <Stack direction="row" h="48px">
        {!store.dashboard?.published && (
          <>
            <Button type="button" onClick={() => addSection()}>
              Add section
            </Button>
            <Button type="button" onClick={() => addSection()}>
              Delete section
            </Button>
            <Button
              type="button"
              onClick={() => updateDashboard(store.dashboard)}
            >
              Save Dashboard
            </Button>
            <Button type="button" onClick={() => fitPage()}>
              Fit Page
            </Button>
            <Button type="button" onClick={() => increment(1)}>
              Increase
            </Button>
            <Button type="button" onClick={() => increment(-1)}>
              Reduce
            </Button>
            <Button onClick={onOpen}>Make Default Dashboard</Button>
            <Button
              onClick={() =>
                add({
                  id: generateUid(),
                  type: "",
                  dataSource: undefined,
                })
              }
            >
              Add Visualization
            </Button>
          </>
        )}
        {store.dashboard?.published && (
          <Button onClick={() => toggleDashboard(false)}>Edit</Button>
        )}
        {!store.dashboard?.published && (
          <Button onClick={() => toggleDashboard(true)}>Publish</Button>
        )}
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
            containerPadding={[5, 5]}
            rowHeight={rowHeight}
            isResizable={!store.dashboard?.published}
          >
            {store.dashboard?.sections.map((section: ISection) => (
              <Stack
                bg="yellow.300"
                onClick={() => setCurrentSection(section)}
                border={
                  store.section?.id === section.id ? "red 1px solid" : "none"
                }
                key={section.id}
                data-grid={section.layout.md}
              >
                <Stack direction="row">
                  <Editable defaultValue={section.name}>
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                  <Spacer />
                  {store.section?.id === section.id &&
                    !store.dashboard?.published && (
                      <Button
                        colorScheme="red"
                        size="xs"
                        onClick={() => deleteSection(section.id)}
                      >
                        X
                      </Button>
                    )}
                </Stack>
                <Box>
                  {section.layout.md.w}-{section.layout.md.h}
                  <pre>{JSON.stringify(section.visualizations, null, 2)}</pre>
                </Box>
              </Stack>
            ))}
          </ReactGridLayout>
        </Box>
      )}
      {isError && <Box>{error.message}</Box>}
      <NewVisualizationDialog isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
};

export default Dashboard;

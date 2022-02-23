import {
  Box,
  Button,
  Spinner,
  Stack,
  Editable,
  EditableInput,
  EditablePreview,
  Spacer,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { fromPairs } from "lodash";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useMatch } from "react-location";
import { useQueryClient } from "react-query";
import "react-resizable/css/styles.css";
import { activateSection, addSection } from "../Events";
import { Section } from "../interfaces";
import { useNamespaceKey } from "../Queries";
import { $layout, $store } from "../Store";

const ReactGridLayout = WidthProvider(Responsive);
const Dashboard = () => {
  const client = useQueryClient();
  const {
    params: { id },
  } = useMatch();

  const { isLoading, isSuccess, isError, data, error } = useNamespaceKey(
    "i-dashboards",
    id
  );
  const store = useStore($store);
  const layout = useStore($layout);
  const onLayoutChange = (layout: Layout[]) => {
    const layouts = fromPairs(layout.map((l: Layout) => [l.i, l]));
    const allSections = store.dashboard.sections.map((section: Section) => {
      return { ...section, layout: layouts[section.id] };
    });
    // addDashboard({ ...store.dashboard, sections: allSections });
  };
  return (
    <Stack>
      <Stack direction="row">
        <Button type="button" onClick={() => addSection()}>
          Add section
        </Button>
        <Button type="button" onClick={() => addSection()}>
          Delete section
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Box>
          <ReactGridLayout
            margin={[0, 0]}
            cols={{ xxl: 12, lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            layouts={layout}
            onLayoutChange={onLayoutChange}
          >
            {store.dashboard?.sections.map((section: Section) => (
              <Stack
                onClick={() => activateSection(section.id)}
                border={store.section === section.id ? "red 1px solid" : "none"}
                key={section.layout.md.i}
                data-grid={section.layout.md.i}
                p="5px"
              >
                <Stack direction="row">
                  <Editable defaultValue={section.name}>
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                  <Spacer />
                  <Button colorScheme="red" size="xs">X</Button>
                </Stack>
              </Stack>
            ))}
          </ReactGridLayout>
        </Box>
      )}
      {isError && <Box>{error.message}</Box>}
    </Stack>
  );
};

export default Dashboard;

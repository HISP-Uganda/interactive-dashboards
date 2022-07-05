import { useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select, SingleValue } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import {
  addSection,
  addVisualization2Section,
  changeSectionAttribute,
  changeVisualizationAttribute,
  setDashboards,
  setShowSider,
} from "../Events";
import { FormGenerics, IVisualization, Option } from "../interfaces";
import { useVisualizationData } from "../Queries";
import {
  $dashboard,
  $dashboards,
  $indicators,
  $section,
  $store,
} from "../Store";
import Visualization from "./visualizations/Visualization";
import VisualizationProperties from "./visualizations/VisualizationProperties";

const chartTypes: Option[] = [
  { value: "single", label: "Single Value" },
  { value: "map", label: "Map" },
  { value: "bar", label: "Bar" },
  { value: "pie", label: "Pie" },
  { value: "line", label: "Line" },
  { value: "sunburst", label: "Sunburst" },
  { value: "gauge", label: "Gauge" },
  { value: "histogram", label: "Histogram" },
  { value: "area", label: "Area Graph" },
  { value: "radar", label: "Radar Graph" },
  { value: "bubblemaps", label: "Bubbble Maps" },
  { value: "funnelplot", label: "Funnel Graph" },
  { value: "multiplecharts", label: "Line and Graph" },
  { value: "treemaps", label: "Tree Map" },
  { value: "tables", label: "Table" },
  { value: "boxplot", label: "Box Plot" },
  { value: "scatterplot", label: "Scatter Plot" },
  
];

const VisualizationTypes = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  return (
    <Stack>
      <Text>Visualization Type</Text>
      <Select<Option, false, GroupBase<Option>>
        value={chartTypes.find((d: Option) => d.value === visualization.type)}
        onChange={(e) =>
          changeVisualizationAttribute({
            attribute: "type",
            value: e?.value,
            visualization: visualization.id,
          })
        }
        options={chartTypes}
        isClearable
      />
    </Stack>
  );
};
const VisualizationQuery = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  const indicators = useStore($indicators);
  const { isLoading, isSuccess, isError, error } = useVisualizationData();
  return (
    <Stack>
      <Text>Visualization Query</Text>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Select<Option, false, GroupBase<Option>>
          value={indicators
            .map((i) => {
              const current: Option = {
                value: i.id,
                label: i.name || "",
              };
              return current;
            })
            .filter((d: Option) => visualization.indicator === d.value)}
          onChange={(e: SingleValue<Option>) => {
            changeVisualizationAttribute({
              attribute: "indicator",
              value: e?.value,
              visualization: visualization.id,
            });
          }}
          options={indicators.map((i) => {
            const current: Option = {
              value: i.id,
              label: i.name || "",
            };
            return current;
          })}
          isClearable
        />
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

const Section = () => {
  const search = useSearch<FormGenerics>();
  const navigate = useNavigate();
  const section = useStore($section);
  const dashboard = useStore($dashboard);
  const dashboards = useStore($dashboards);
  const store = useStore($store);

  const onApply = () => {
    addSection(section);
    setDashboards(
      dashboards.map((dash) => {
        if (dash.id === dashboard.id) {
          return { ...dash, sections: [...dash.sections, section] };
        }
        return dash;
      })
    );
    navigate({
      to: `/dashboards/${dashboard.id}`,
      search: {
        ...search,
        category: dashboard.category,
        periods: store.periods.map((i) => i.id),
        organisations: store.organisations,
        groups: store.groups,
        levels: store.levels,
        edit: true,
      },
    });
  };

  useEffect(() => {
    setShowSider(false);
  }, []);
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <IconButton
            bg="none"
            _hover={{ bg: "none" }}
            aria-label="Search database"
            icon={<MdKeyboardBackspace />}
            onClick={()=> {
              navigate({
                to: `/dashboards/${dashboard.id}`,
              });
            }}
          />
          <Stack direction="row" spacing="2px" fontSize="16px">
            <Text>{dashboard.name}</Text>
            <Text>/</Text>
            <Text>Edit Section</Text>
          </Stack>
        </Stack>
        <Spacer />
        <Stack direction="row" alignItems="center" justifyItems="center">
          <Button size="sm">Discard</Button>
          <Button size="sm" onClick={() => onApply()}>
            Apply
          </Button>
        </Stack>
      </Stack>
      <Stack></Stack>
      <Stack direction="row" spacing="20px">
        <Stack w="75%">
          <Text textAlign="center">{section.title}</Text>
          <Stack>
            {section.visualizations.map((visualization: IVisualization) => (
              <Visualization
                key={visualization.id}
                visualization={visualization}
              />
            ))}
          </Stack>
        </Stack>
        <Stack w="25%">
          <Accordion>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Section options
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack>
                  <Text>Title</Text>
                  <Input
                    value={section.title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      changeSectionAttribute({
                        attribute: "title",
                        value: e.target.value,
                      })
                    }
                  />
                </Stack>
                <Stack>
                  <Text>Arrangement</Text>
                  <RadioGroup
                    onChange={(e: string) =>
                      changeSectionAttribute({
                        attribute: "direction",
                        value: e,
                      })
                    }
                    value={section.direction}
                  >
                    <Stack direction="row">
                      <Radio value="row">Horizontal</Radio>
                      <Radio value="column">Vertical</Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            {section.visualizations.map((visualization: IVisualization) => (
              <AccordionItem key={visualization.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {visualization.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Stack spacing="20px">
                    <Stack>
                      <Text>Title</Text>
                      <Input
                        value={visualization.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          changeVisualizationAttribute({
                            attribute: "name",
                            value: e.target.value,
                            visualization: visualization.id,
                          })
                        }
                      />
                    </Stack>
                    <VisualizationQuery visualization={visualization} />
                    <VisualizationTypes visualization={visualization} />
                    <VisualizationProperties visualization={visualization} />
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <Button onClick={() => addVisualization2Section()}>
            Add Visualization
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Section;

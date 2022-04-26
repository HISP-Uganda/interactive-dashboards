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
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, MultiValue, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import {
  addSection,
  addVisualization2Section,
  changeSectionAttribute,
  changeVisualizationAttribute,
  setCurrentSection,
  setShowSider,
} from "../Events";
import { FormGenerics, IVisualization, Option } from "../interfaces";
import { useVisualizationData } from "../Queries";
import { $dashboard, $indicators, $section, createSection } from "../Store";
import Visualization from "./visualizations/Visualization";
import VisualizationProperties from "./visualizations/VisualizationProperties";

const chartTypes: Option[] = [
  { value: "single", label: "Single Value" },
  { value: "map", label: "Map" },
  { value: "bar", label: "Bar" },
  { value: "stacked bar", label: "Stacked Bar" },
  { value: "column", label: "Column" },
  { value: "stacked column", label: "Stacked Column" },
  { value: "pie", label: "Pie" },
  { value: "line", label: "Line" },
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
        <Select<Option, true, GroupBase<Option>>
          isMulti
          value={indicators
            .map((i) => {
              const current: Option = {
                value: i.id,
                label: i.name || "",
              };
              return current;
            })
            .filter(
              (d: Option) => visualization.indicators.indexOf(d.value) !== -1
            )}
          onChange={(e: MultiValue<Option>) => {
            changeVisualizationAttribute({
              attribute: "indicators",
              value: e.map((v) => v.value),
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

  // useEffect(() => {
  //   setShowSider(false);
  // }, []);
  return (
    <Stack flex={1} p="20px">
      <Stack direction="row">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <IconButton
            bg="none"
            _hover={{ bg: "none" }}
            aria-label="Search database"
            icon={<MdKeyboardBackspace />}
          />
          <Stack direction="row" spacing="2px">
            <Text>{dashboard.name}</Text>
            <Text>/</Text>
            <Text>Edit Section</Text>
          </Stack>
        </Stack>
        <Spacer />
        <Stack direction="row" alignItems="center" justifyItems="center">
          <Button>Discard</Button>
          <Button
            onClick={() => {
              addSection(section);
              navigate({ to: "/dashboards/form", search });
            }}
          >
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
                    <VisualizationTypes visualization={visualization} />
                    <VisualizationQuery visualization={visualization} />
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

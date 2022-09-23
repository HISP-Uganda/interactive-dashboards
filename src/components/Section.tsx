import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GroupBase, Select, SingleValue } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import {
  addVisualization2Section,
  changeSectionAttribute,
  changeVisualizationAttribute,
  changeVisualizationOverride,
  changeVisualizationProperties,
  setShowSider,
} from "../Events";
import { IVisualization, Option } from "../interfaces";
import { useVisualizationData } from "../Queries";
import { $indicators, $section } from "../Store";
import { chartTypes } from "../utils/utils";
import ColorPalette from "./ColorPalette";
import HAndWAware from "./HAndWAware";
import Carousel from "./visualizations/Carousel";
import Visualization from "./visualizations/Visualization";
import VisualizationProperties from "./visualizations/VisualizationProperties";
import VisualizationTitle from "./visualizations/VisualizationTitle";

const fontSizes: Option[] = [
  {
    label: "0.5vh",
    value: "0.5vh",
  },
  {
    label: "1.0vh",
    value: "1.0vh",
  },
  {
    label: "1.5vh",
    value: "1.5vh",
  },
  {
    label: "2.0vh",
    value: "2.0vh",
  },
  {
    label: "2.5vh",
    value: "2.5vh",
  },
  {
    label: "3.0vh",
    value: "3.0vh",
  },
  {
    label: "3.5vh",
    value: "3.5vh",
  },
  {
    label: "4.0vh",
    value: "4.0vh",
  },
  {
    label: "4.5vh",
    value: "4.5vh",
  },
  {
    label: "5.0vh",
    value: "5.0vh",
  },
  {
    label: "5.5vh",
    value: "5.5vh",
  },
];

const alignmentOptions: Option[] = [
  { label: "flex-start", value: "flex-start" },
  { label: "flex-end", value: "flex-end" },
  { label: "center", value: "center" },
  { label: "space-between", value: "space-between" },
  { label: "space-around", value: "space-around" },
  { label: "space-evenly", value: "space-evenly" },
  { label: "stretch", value: "stretch" },
  { label: "start", value: "start" },
  { label: "end", value: "end" },
  { label: "baseline", value: "baseline" },
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

const VisualizationOverride = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  const indicators = useStore($indicators);
  const indicator = indicators.find((i) => i.id === visualization.indicator);
  return (
    <>
      {indicator && indicator.numerator?.type === "ANALYTICS" && (
        <Stack>
          <Text>Overrides</Text>
          <Stack direction="row">
            <Text>DX</Text>
            <RadioGroup
              value={visualization.overrides["dx"]}
              onChange={(e: string) =>
                changeVisualizationOverride({
                  override: "dx",
                  value: e,
                  visualization: visualization.id,
                })
              }
            >
              <Stack direction="row">
                <Radio value="dimension">Dimension</Radio>
                <Radio value="filter">Filter</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Stack direction="row">
            <Text>OU</Text>
            <RadioGroup
              value={visualization.overrides["ou"]}
              onChange={(e: string) =>
                changeVisualizationOverride({
                  override: "ou",
                  value: e,
                  visualization: visualization.id,
                })
              }
            >
              <Stack direction="row">
                <Radio value="dimension">Dimension</Radio>
                <Radio value="filter">Filter</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Stack direction="row">
            <Text>OU Level</Text>
            <RadioGroup
              value={visualization.overrides["oul"]}
              onChange={(e: string) =>
                changeVisualizationOverride({
                  override: "oul",
                  value: e,
                  visualization: visualization.id,
                })
              }
            >
              <Stack direction="row">
                <Radio value="dimension">Dimension</Radio>
                <Radio value="filter">Filter</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Stack direction="row">
            <Text>OU Group</Text>
            <RadioGroup
              value={visualization.overrides["oug"]}
              onChange={(e: string) =>
                changeVisualizationOverride({
                  override: "oug",
                  value: e,
                  visualization: visualization.id,
                })
              }
            >
              <Stack direction="row">
                <Radio value="dimension">Dimension</Radio>
                <Radio value="filter">Filter</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Stack direction="row">
            <Text>PE</Text>
            <RadioGroup
              value={visualization.overrides["pe"]}
              onChange={(e: string) =>
                changeVisualizationOverride({
                  override: "pe",
                  value: e,
                  visualization: visualization.id,
                })
              }
            >
              <Stack direction="row">
                <Radio value="dimension">Dimension</Radio>
                <Radio value="filter">Filter</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        </Stack>
      )}
    </>
  );
};

const Section = () => {
  const section = useStore($section);
  const [active, setActive] = useState<string>("title");

  useEffect(() => {
    setShowSider(false);
  }, []);

  const toggle = (id: string) => {
    if (active === id) {
      setActive("");
    } else {
      setActive(id);
    }
  };
  return (
    <Grid templateColumns="1fr 30%" gap={1} h="100%">
      <GridItem bg="white" h="100%" w="100%">
        {section.display === "carousel" ? (
          <Carousel {...section} />
        ) : section.display === "marquee" ? (
          <HAndWAware h="100%" w="100%">
            <Marquee
              style={{ padding: 0, margin: 0 }}
              gradient={false}
              speed={40}
            >
              {section.visualizations.map((visualization) => (
                <Stack direction="row" key={visualization.id}>
                  <Visualization
                    section={section}
                    key={visualization.id}
                    visualization={visualization}
                  />
                  <Box w="50px">&nbsp;</Box>
                </Stack>
              ))}
            </Marquee>
          </HAndWAware>
        ) : (
          <Stack h="100%">
            {section.title && (
              <VisualizationTitle
                section={section}
                fontSize={"18px"}
                textTransform={"uppercase"}
                color={"gray.500"}
                title={section.title}
                fontWeight="bold"
              />
            )}
            {section.direction === "grid" ? (
              <SimpleGrid
                columns={2}
                alignItems="center"
                justifyContent="center"
                alignContent="center"
              >
                {section.visualizations.map((visualization) => (
                  <Visualization
                    key={visualization.id}
                    visualization={visualization}
                    section={section}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Stack
                alignItems="center"
                justifyItems="center"
                alignContent="center"
                justifyContent={section.justifyContent || "space-around"}
                direction={section.direction}
                flex={1}
                p="5px"
              >
                {section.visualizations.map((visualization) => (
                  <Visualization
                    key={visualization.id}
                    visualization={visualization}
                    section={section}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </GridItem>
      <GridItem h="100%">
        <Grid templateRows="1fr 48px" gap={1} h="100%">
          <GridItem bg="white" overflow="auto" p="5px">
            <Stack h="calc(100vh - 300px)" overflow="auto">
              <Stack spacing="20px">
                <Stack
                  direction="row"
                  onClick={() => toggle("title")}
                  cursor="pointer"
                  fontSize="xl"
                >
                  <Text>Section options</Text>
                  <Spacer />
                  {active === "title" ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </Stack>
                {active === "title" && (
                  <Stack pl="10px" spacing="20px">
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

                    <Text>Row Span</Text>
                    <NumberInput
                      value={section.rowSpan}
                      max={12}
                      min={1}
                      onChange={(value1: string, value2: number) =>
                        changeSectionAttribute({
                          attribute: "rowSpan",
                          value: value2,
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>

                    <Text>Column Span</Text>
                    <NumberInput
                      value={section.colSpan}
                      max={24}
                      min={1}
                      onChange={(value1: string, value2: number) =>
                        changeSectionAttribute({
                          attribute: "colSpan",
                          value: value2,
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
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
                        <Radio value="grid">Grid</Radio>
                      </Stack>
                    </RadioGroup>

                    <Text>Content Alignment</Text>
                    <Select<Option, false, GroupBase<Option>>
                      value={alignmentOptions.find(
                        (d: Option) => d.value === section.justifyContent
                      )}
                      onChange={(e) =>
                        changeSectionAttribute({
                          attribute: "justifyContent",
                          value: e?.value,
                        })
                      }
                      options={alignmentOptions}
                      isClearable
                    />
                    <Text>Display Style</Text>
                    <RadioGroup
                      value={section.display}
                      onChange={(e: string) =>
                        changeSectionAttribute({
                          attribute: "display",
                          value: e,
                        })
                      }
                    >
                      <Stack direction="row">
                        <Radio value="normal">Normal</Radio>
                        <Radio value="carousel">Carousel</Radio>
                        <Radio value="marquee">Marquee</Radio>
                      </Stack>
                    </RadioGroup>

                    <Text>Carousel Over</Text>
                    <RadioGroup
                      value={section.carouselOver}
                      onChange={(e: string) =>
                        changeSectionAttribute({
                          attribute: "carouselOver",
                          value: e,
                        })
                      }
                    >
                      <Stack direction="row">
                        <Radio value="items">Items</Radio>
                        <Radio value="groups">Groups</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                )}
              </Stack>
              {section.visualizations.map((visualization: IVisualization) => (
                <Stack key={visualization.id}>
                  <Stack
                    direction="row"
                    onClick={() => toggle(visualization.id)}
                    cursor="pointer"
                    fontSize="xl"
                  >
                    <Text>{visualization.name}</Text>
                    <Spacer />
                    {active === visualization.id ? (
                      <ChevronDownIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </Stack>
                  {active === visualization.id && (
                    <Stack pl="10px" spacing="20px">
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
                      <Text>Title font size</Text>
                      <NumberInput
                        value={
                          visualization.properties["data.title.fontSize"] || 2
                        }
                        max={10}
                        min={1}
                        step={0.1}
                        onChange={(value1: string, value2: number) =>
                          changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.title.fontSize",
                            value: value2,
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                      <Text>Title font weight</Text>

                      <NumberInput
                        value={
                          visualization.properties["data.title.fontWeight"] || 2
                        }
                        max={1000}
                        min={100}
                        step={50}
                        onChange={(value1: string, value2: number) =>
                          changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.title.fontWeight",
                            value: value2,
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                      <Text>Title font color</Text>
                      <ColorPalette
                        visualization={visualization}
                        attribute="data.title.color"
                      />
                      <VisualizationQuery visualization={visualization} />
                      <VisualizationOverride visualization={visualization} />
                      <VisualizationTypes visualization={visualization} />
                      <VisualizationProperties visualization={visualization} />
                    </Stack>
                  )}
                </Stack>
              ))}
            </Stack>
          </GridItem>
          <GridItem bg="white">
            <Stack
              h="100%"
              alignContent="center"
              justifyContent="center"
              justifyItems="center"
              alignItems="center"
            >
              <Button
                variant="ghost"
                onClick={() => {
                  addVisualization2Section();
                  setActive(
                    section.visualizations[section.visualizations.length - 1]
                      ?.id
                  );
                }}
              >
                Add Visualization
              </Button>
            </Stack>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default Section;

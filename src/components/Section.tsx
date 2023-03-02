import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState, DragEvent, useRef } from "react";
import { BiDuplicate } from "react-icons/bi";
import {
  addVisualization2Section,
  changeSectionAttribute,
  changeVisualizationAttribute,
  changeVisualizationOverride,
  changeVisualizationProperties,
  deleteSectionVisualization,
  duplicateVisualization,
  setShowSider,
  setVisualizations,
} from "../Events";
import { IVisualization, Option } from "../interfaces";
import { useVisualizationData } from "../Queries";
import { $dimensions, $indicators, $section, $store } from "../Store";
import { generateUid } from "../utils/uid";
import { chartTypes } from "../utils/utils";
import ColorPalette from "./ColorPalette";
import { headerHeight } from "./constants";
import SectionImages from "./SectionImages";
import SectionVisualization from "./SectionVisualization";
import VisualizationProperties from "./visualizations/VisualizationProperties";
import LoadingIndicator from "./LoadingIndicator";
import SectionColorPalette from "./SectionColorPalette";

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
  const { systemId } = useStore($store);
  const { isLoading, isSuccess, isError, error } =
    useVisualizationData(systemId);
  return (
    <Stack>
      <Text>Visualization Query</Text>
      {isLoading && <LoadingIndicator />}
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
              (d: Option) =>
                String(visualization.indicator).split(",").indexOf(d.value) !==
                -1
            )}
          onChange={(e) => {
            changeVisualizationAttribute({
              attribute: "indicator",
              value: e.map((ex) => ex.value).join(","),
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
      {isError && <Text>No data/Error occurred</Text>}
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
  const { otherHeight, sectionHeight } = useStore($dimensions);

  useEffect(() => {
    setShowSider(false);
  }, []);

  const dragItem = useRef<number | undefined | null>();
  const dragOverItem = useRef<number | null>();
  const dragStart = (e: DragEvent<HTMLButtonElement>, position: number) => {
    dragItem.current = position;
    console.log(position);
  };

  const dragEnter = (e: DragEvent<HTMLButtonElement>, position: number) => {
    dragOverItem.current = position;
    console.log(position);
  };

  const drop = (e: DragEvent<HTMLButtonElement>) => {
    const copyListItems = [...section.visualizations];

    if (
      dragItem.current !== null &&
      dragItem.current !== undefined &&
      dragOverItem.current !== null &&
      dragOverItem.current !== undefined
    ) {
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setVisualizations(copyListItems);
    }
  };

  return (
    <Grid
      templateColumns="1fr 30%"
      gap="5px"
      h={otherHeight}
      maxH={otherHeight}
    >
      <GridItem bgColor="white" h={otherHeight} maxH={otherHeight} w="100%">
        <SectionVisualization {...section} />
      </GridItem>
      <Grid
        templateRows={`${headerHeight * 3}px 1fr`}
        gap="5px"
        h={otherHeight}
        maxH={otherHeight}
      >
        <Flex
          gap="5px"
          flexWrap="wrap"
          bgColor="white"
          p="5px"
          alignContent="flex-start"
        >
          <Button
            size="sm"
            onClick={() => setActive(() => "title")}
            variant="outline"
            colorScheme={active === "title" ? "teal" : "gray"}
          >
            Section options
          </Button>
          {section.visualizations.map((visualization, index) => (
            <Button
              draggable
              onDragStart={(e) => dragStart(e, index)}
              onDragEnter={(e) => dragEnter(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={drop}
              size="sm"
              variant="outline"
              key={visualization.id}
              colorScheme={active === visualization.id ? "teal" : "yellow"}
              onClick={() => setActive(() => visualization.id)}
            >
              {visualization.name || visualization.id}
            </Button>
          ))}
          <Button
            size="sm"
            onClick={() => {
              const id = generateUid();
              addVisualization2Section(id);
              setActive(id);
            }}
          >
            Add Visualization
          </Button>
        </Flex>
        <Stack overflow="auto" flex={1}>
          {active === "title" && (
            <Stack p="10px" spacing="20px" bgColor="white" flex={1}>
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

              <Text>Height(when on small devices)</Text>
              <Input
                value={section.height}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeSectionAttribute({
                    attribute: "height",
                    value: e.target.value,
                  })
                }
              />
              <Text>Background Colour</Text>
              <SectionColorPalette section={section} />
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
                  <Radio value="grid">Grid</Radio>
                  <Radio value="tab">Tabs</Radio>
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
              <SectionImages />
            </Stack>
          )}
          {section.visualizations.map(
            (visualization) =>
              visualization.id === active && (
                <Stack
                  key={visualization.id}
                  // bgColor={visualization.bg}
                  bgColor="white"
                  overflow="auto"
                  flex={1}
                >
                  <Stack direction="row" fontSize="xl" p="10px" spacing="0">
                    <Text>{`${visualization.name}(${visualization.id})`}</Text>
                    <Spacer />
                    <IconButton
                      variant="ghost"
                      onClick={() => {
                        const id = generateUid();
                        duplicateVisualization({ ...visualization, id });
                        setActive(() => id);
                      }}
                      icon={<BiDuplicate color="green" size="24px" />}
                      aria-label="Down"
                    />
                    <IconButton
                      variant="ghost"
                      onClick={() => {
                        deleteSectionVisualization(visualization.id);
                        if (section.visualizations.length > 1) {
                          const viz =
                            section.visualizations[
                              section.visualizations.length - 2
                            ];
                          setActive(() => viz.id);
                        } else {
                          setActive(() => "title");
                        }
                      }}
                      icon={<DeleteIcon color="red" />}
                      aria-label="Down"
                    />
                  </Stack>
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
                          visualization: visualization?.id,
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
                        visualization.properties["data.title.fontWeight"] || 250
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
                    <Text>Expression</Text>
                    <Textarea
                      value={visualization.expression}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        changeVisualizationAttribute({
                          attribute: "expression",
                          value: e.target.value,
                          visualization: visualization.id,
                        })
                      }
                    />
                    <VisualizationOverride visualization={visualization} />
                    <VisualizationTypes visualization={visualization} />
                    <VisualizationProperties visualization={visualization} />
                  </Stack>
                </Stack>
              )
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Section;

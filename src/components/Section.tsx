import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
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
import { ChangeEvent, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { MdKeyboardBackspace } from "react-icons/md";
import {
  addSection,
  addVisualization2Section,
  changeSectionAttribute,
  changeVisualizationAttribute,
  changeVisualizationOverride,
  changeVisualizationProperties,
  setDashboards,
  setShowSider,
} from "../Events";
import { FormGenerics, IVisualization, Option } from "../interfaces";
import { useVisualizationData } from "../Queries";
import { $dashboard, $dashboards, $indicators, $section } from "../Store";
import { chartTypes } from "../utils/utils";
import ColorPalette from "./ColorPalette";
import Carousel from "./visualizations/Carousel";
import Visualization from "./visualizations/Visualization";
import VisualizationProperties from "./visualizations/VisualizationProperties";

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
  const search = useSearch<FormGenerics>();
  const navigate = useNavigate();
  const section = useStore($section);
  const dashboard = useStore($dashboard);
  const dashboards = useStore($dashboards);
  const [active, setActive] = useState<string>("title");
  const onApply = () => {
    addSection(section);
    setDashboards(
      dashboards.map((dash) => {
        if (dash.id === dashboard.id) {
          const isOld = dashboard.sections.find((s) => s.i === section.i);
          let sections = dashboard.sections.map((s) => {
            if (section.i === s.i) {
              return section;
            }
            return s;
          });
          if (!isOld) {
            sections = [...sections, section];
          }
          return { ...dashboard, sections };
        }
        return dash;
      })
    );
    navigate({
      to: `/dashboards/${dashboard.id}`,
      search,
    });
  };

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
    <Stack p="5px">
      <Stack direction="row" h="48px">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <IconButton
            bg="none"
            _hover={{ bg: "none" }}
            aria-label="Search database"
            icon={<MdKeyboardBackspace />}
            onClick={() => {
              navigate({
                to: `/dashboards/${dashboard.id}`,
              });
            }}
          />
          <Stack direction="row" spacing="2px" fontSize="16px">
            <Text>{dashboard.name}</Text>
            <Text>/</Text>
            <Text>{section.i}</Text>
            <Text>/</Text>
            <Text>Edit Section</Text>
          </Stack>
        </Stack>
        <Spacer />
        <Button
          size="sm"
          onClick={() => {
            navigate({
              to: `/dashboards/${dashboard.id}`,
            });
          }}
        >
          Discard
        </Button>
        <Button size="sm" onClick={() => onApply()}>
          Apply
        </Button>
      </Stack>
      <Stack direction="row" spacing="20px" flex={1}>
        <Stack w="75%">
          {section.title && <Text textAlign="center">{section.title}</Text>}
          {section.display === "carousel" ? (
            <Carousel {...section} />
          ) : section.display === "marquee" ? (
            <Marquee>
              {section.visualizations.map((visualization) => (
                <Visualization
                  key={visualization.id}
                  visualization={visualization}
                />
              ))}
            </Marquee>
          ) : (
            <Stack direction={section.direction}>
              {section.visualizations.map((visualization) => (
                <Visualization
                  key={visualization.id}
                  visualization={visualization}
                />
              ))}
            </Stack>
          )}
        </Stack>
        <Stack w="25%" spacing="20px">
          <Stack h="calc(100vh - 200px)" overflow="auto">
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
                    <Select<Option, false, GroupBase<Option>>
                      value={fontSizes.find(
                        (pt) =>
                          pt.value ===
                          visualization.properties?.["data.title.fontsize"]
                      )}
                      onChange={(e) =>
                        changeVisualizationProperties({
                          visualization: visualization.id,
                          attribute: "data.title.fontsize",
                          value: e?.value,
                        })
                      }
                      options={fontSizes}
                      isClearable
                    />
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
          <Button
            onClick={() => {
              addVisualization2Section();
              setActive(
                section.visualizations[section.visualizations.length - 1]?.id
              );
            }}
          >
            Add Visualization
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Section;

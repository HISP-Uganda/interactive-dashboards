// import { ResponsiveChoropleth } from "@nivo/geo";
import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChartProps, Threshold } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $indicators, $store } from "../../Store";
import VisualizationTitle from "./VisualizationTitle";
import LoadingIndicator from "../LoadingIndicator";

export default function ({
  visualization,
  dataProperties,
  layoutProperties,
  section,
  data,
}: ChartProps) {
  const indicators = useStore($indicators);
  const indicator = indicators.find((v) => v.id === visualization.indicator);
  const { levels, ous } = findLevelsAndOus(indicator);
  const levelIsGlobal = levels.findIndex((l) => l === "GQhi6pRnTKF");
  const ouIsGlobal = ous.findIndex((l) => l === "mclvD0Z9mfT");
  const style = layoutProperties?.["layout.mapbox.style"] || "open-street-map";
  const zoom = layoutProperties?.["layout.zoom"] || 5.3;

  const titleFontSize = dataProperties?.["data.title.fontsize"] || "1.5vh";
  const titleCase = dataProperties?.["data.title.case"] || "";
  const titleColor = dataProperties?.["data.title.color"] || "gray.500";
  const thresholds: Threshold[] = dataProperties?.["data.thresholds"] || [
    { id: "1", min: "0", max: "5000", color: "red" },
    { id: "2", min: "5001", max: "10000", color: "yellow" },
    { id: "3", min: "10001", color: "green" },
  ];
  const store = useStore($store);
  const {
    isLoading,
    isError,
    isSuccess,
    error,
    data: metadata,
  } = useMaps(
    levelIsGlobal !== -1 || levels.length === 0 ? store.levels : levels,
    ouIsGlobal !== -1 ? store.organisations.map((k) => String(k)) : ous,
    data,
    thresholds,
    []
  );
  return (
    <>
      {isLoading && <LoadingIndicator />}
      {isSuccess && (
        <Stack w="100%" h="100%" spacing={0}>
          {visualization.name && (
            <VisualizationTitle
              section={section}
              fontSize={titleFontSize}
              textTransform={titleCase}
              color={titleColor}
              title={visualization.name}
              fontWeight="bold"
            />
          )}
          <Stack h="100%" w="100%" flex={1} spacing={0}>
            <Stack flex={1} h="400px" w="100%" spacing={0}>
              {/* <ResponsiveChoropleth
                data={data.map(({ c, value }: any) => {
                  return { id: c, value };
                })}
                features={metadata.geojson.features}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                colors="nivo"
                domain={[0, 1000000]}
                unknownColor="#666666"
                label="properties.name"
                valueFormat=".2s"
                projectionTranslation={[0.4, 0.45]}
                projectionRotation={[0, 0, 0]}
                enableGraticule={true}
                graticuleLineColor="#dddddd"
                borderWidth={0.5}
                borderColor="#152538"
                projectionScale={600}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "#38bcb2",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "#eed312",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                  {
                    id: "gradient",
                    type: "linearGradient",
                    colors: [
                      {
                        offset: 0,
                        color: "#000",
                      },
                      {
                        offset: 100,
                        color: "inherit",
                      },
                    ],
                  },
                ]}
                fill={[
                  {
                    match: {
                      id: "CAN",
                    },
                    id: "dots",
                  },
                  {
                    match: {
                      id: "CHN",
                    },
                    id: "lines",
                  },
                  {
                    match: {
                      id: "ATA",
                    },
                    id: "gradient",
                  },
                ]}
                legends={[
                  {
                    anchor: "bottom-left",
                    direction: "column",
                    justify: true,
                    translateX: 20,
                    translateY: -100,
                    itemsSpacing: 0,
                    itemWidth: 94,
                    itemHeight: 18,
                    itemDirection: "left-to-right",
                    itemTextColor: "#444444",
                    itemOpacity: 0.85,
                    symbolSize: 18,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000000",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              /> */}
            </Stack>
            <Stack h="20px" direction="row" spacing={0}>
              {thresholds.map((item) => (
                <Text
                  key={item.id}
                  backgroundColor={item.color}
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="black"
                  fontWeight="bolder"
                  height="100%"
                >
                  {item.max && item.min
                    ? `${item.min} - ${item.max}`
                    : item.min
                    ? `${item.min}+`
                    : item.max}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
      {isError && <Text>No data/Error occurred</Text>}
    </>
  );
}

import { Spinner, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChartProps, Threshold } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $indicators, $store } from "../../Store";
import VisualizationTitle from "./VisualizationTitle";

import "leaflet/dist/leaflet.css";
import MapVisualization from "./MapVisualization";

const MapChartLeaflet = ({
  visualization,
  dataProperties,
  layoutProperties,
  section,
  data,
}: ChartProps) => {
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
    thresholds
  );

  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack w="100%" h="100%" spacing={0}>
          {visualization.name && (
            <VisualizationTitle section={section} title={visualization.name} />
          )}
          <Stack h="100%" w="100%" flex={1} spacing={0}>
            <Stack flex={1} h="100%" w="100%" spacing={0}>
              <MapVisualization metadata={metadata} id={visualization.id} />
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
                  color="white"
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
      {isError && <pre>{JSON.stringify(error)}</pre>}
    </>
  );
};

export default MapChartLeaflet;

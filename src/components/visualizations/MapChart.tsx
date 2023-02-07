import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { max, orderBy } from "lodash";
import Plot from "react-plotly.js";
import { ChartProps, Threshold } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $globalFilters, $indicators, $store } from "../../Store";
import { exclusions } from "../../utils/utils";
import VisualizationTitle from "./VisualizationTitle";
import LoadingIndicator from "../LoadingIndicator";

const MapChart = ({
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
  const globalFilters = useStore($globalFilters);
  const zoom = layoutProperties?.["layout.zoom"] || 5.3;
  const thresholds: Threshold[] = dataProperties?.["data.thresholds"] || [
    { id: "1", min: "0", max: "5000", color: "red" },
    { id: "2", min: "5001", max: "10000", color: "yellow" },
    { id: "3", min: "10001", color: "green" },
  ];
  const titleFontSize = dataProperties?.["data.title.fontsize"] || "1.5vh";
  const titleCase = dataProperties?.["data.title.case"] || "";
  const titleColor = dataProperties?.["data.title.color"] || "gray.500";
  const colorscale = orderBy(
    dataProperties?.["data.mapKeys"] || [
      { id: "1", key: 0, value: "red" },
      { id: "2", key: 0.75, value: "yellow" },
      { id: "6", key: 1.0, value: "green" },
    ],
    (v: any) => v.key,
    ["asc"]
  ).map(({ key, value }: any) => [key, value]);
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
    [
      visualization.id,
      ...Object.keys(globalFilters).flatMap((v) => {
        return v;
      }),
    ]
  );
  return (
    <>
      {isLoading && <LoadingIndicator />}
      {isSuccess && (
        <Stack w="100%" h="100%" spacing={0}>
          {visualization.name && (
            <VisualizationTitle section={section} title={visualization.name} />
          )}
          <Stack h="100%" w="100%" flex={1}>
            <Plot
              data={[
                {
                  type: "choroplethmapbox",
                  // hovertemplate: ".2r",
                  locations: metadata.organisationUnits.map(
                    (ou: { id: string; name: string }) => ou.name
                  ),
                  z: metadata.organisationUnits.map(({ id, ...rest }: any) => {
                    const dataValue = data.find(
                      (dt: any) => dt.ou === id || dt.c === id
                    );
                    if (dataValue) {
                      return dataValue.value;
                    }
                    return "";
                  }),
                  featureidkey: "properties.name",
                  geojson: metadata.geojson,
                  zauto: false,
                  autocolorscale: false,
                  zmin: 0,
                  zmax: max(data.map((d: any) => d.value || d.total)),
                  colorscale,
                } as any,
              ]}
              layout={{
                mapbox: {
                  style,
                  center: {
                    lon: metadata.mapCenter[0],
                    lat: metadata.mapCenter[1],
                  },
                  zoom,
                },
                autosize: true,
                margin: {
                  pad: 0,
                  r: 0,
                  t: 0,
                  l: 0,
                  b: 0,
                },
              }}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
              config={{
                displayModeBar: "hover",
                responsive: true,
                toImageButtonOptions: {
                  format: "svg",
                  scale: 1,
                },
                modeBarButtonsToRemove: exclusions,
                displaylogo: false,
              }}
            />
          </Stack>
        </Stack>
      )}
      {isError && <Text>No data/Error occurred</Text>}
    </>
  );
};

export default MapChart;

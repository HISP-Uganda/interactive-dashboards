import { Spinner, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { max, orderBy } from "lodash";
import Plot from "react-plotly.js";
import { ChartProps } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $indicators, $store, $visualizationData } from "../../Store";
import { exclusions } from "../../utils/utils";
import VisualizationTitle from "./VisualizationTitle";

const MapChart = ({
  visualization,
  dataProperties,
  layoutProperties,
  section,
}: ChartProps) => {
  const visualizationData = useStore($visualizationData);
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
  const colorscale = orderBy(
    Object.values(
      dataProperties?.["data.mapKeys"] || {
        "1": [0, "white"],
        "2": [0.2, "lightyellow"],
        "3": [0.4, "orange"],
        "4": [0.6, "lime"],
        "5": [0.8, "lightgreen"],
        "6": [1.0, "green"],
      }
    ),
    (v: [number, string]) => v[0],
    ["asc"]
  );
  const store = useStore($store);
  const data = visualizationData[visualization.id]
    ? visualizationData[visualization.id]
    : [];

  const {
    isLoading,
    isError,
    isSuccess,
    error,
    data: metadata,
  } = useMaps(
    levelIsGlobal !== -1 || levels.length === 0 ? store.levels : levels,
    ouIsGlobal !== -1 ? store.organisations.map((k) => String(k)) : ous
  );
  return (
    <>
      {isLoading && <Spinner />}
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
          <Stack h="100%" w="100%" flex={1}>
            <Plot
              data={[
                {
                  type: "choroplethmapbox",
                  hoverformat: ".2r",
                  locations: metadata.organisationUnits.map(
                    (ou: { id: string; name: string }) => ou.name
                  ),
                  z: metadata.organisationUnits.map(({ id }: any) => {
                    const dataValue = data.find(
                      (dt: any) => dt.ou === id || dt.c === id
                    );
                    if (dataValue) {
                      return dataValue.value;
                    }
                    return 0;
                  }),
                  featureidkey: "properties.name",
                  geojson: metadata.geojson,
                  zmin: 0,
                  autocolorscale: false,
                  zmax: max([
                    ...metadata.organisationUnits.map(({ id }: any) => {
                      const dataValue = data.find((dt: any) => dt.ou === id);
                      if (dataValue) {
                        return dataValue.value;
                      }
                      return 0;
                    }),
                    100,
                  ]),
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
      {isError && <pre>{JSON.stringify(error)}</pre>}
    </>
  );
};

export default MapChart;

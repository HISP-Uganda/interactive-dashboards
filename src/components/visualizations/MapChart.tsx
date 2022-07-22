import { Spinner, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { findLevelsAndOus, useMaps } from "../../Queries";
import { $indicators, $store, $visualizationData } from "../../Store";

type MapChartProps = {
  visualization: IVisualization;
  layoutProperties?: { [key: string]: any };
  dataProperties?: { [key: string]: any };
};

const MapChart = ({ visualization }: MapChartProps) => {
  const visualizationData = useStore($visualizationData);
  const indicators = useStore($indicators);

  const indicator = indicators.find((v) => v.id === visualization.indicator);
  const { levels, ous } = findLevelsAndOus(indicator);

  const levelIsGlobal = levels.findIndex((l) => l === "GQhi6pRnTKF");
  const ouIsGlobal = ous.findIndex((l) => l === "mclvD0Z9mfT");

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
        <Stack w="100%" h="100%">
          <Text textAlign="center">{visualization.name}</Text>
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
                    const dataValue = data.find((dt: any) => dt.ou === id);
                    if (dataValue) {
                      return dataValue.value;
                    }
                    return 0;
                  }),
                  featureidkey: "properties.name",
                  geojson: metadata.geojson,
                } as any,
              ]}
              layout={{
                mapbox: {
                  style: "open-street-map",
                  center: {
                    lon: metadata.mapCenter[0],
                    lat: metadata.mapCenter[1],
                  },
                  zoom: 5.5,
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
                displayModeBar: true,
                responsive: true,
                toImageButtonOptions: {
                  format: "svg",
                  scale: 1,
                },

                modeBarButtonsToRemove: [
                  "pan2d",
                  "lasso2d",
                  "zoom2d",
                  "select2d",
                  "autoScale2d",
                  "zoomIn2d",
                  "zoomOut2d",
                  "resetScale2d",
                  "resetViews",
                  "zoomInGeo",
                  "zoomOut2d",
                  "pan3d",
                  "resetCameraDefault3d",
                  "resetGeo",
                ],
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

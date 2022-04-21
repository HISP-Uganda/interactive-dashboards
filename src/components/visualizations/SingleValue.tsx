import { Box, Spinner, Stack } from "@chakra-ui/react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { useVisualization } from "../../Queries";
import { processSingleValuedSQLViews } from "../processors";

type SingleValueProps = {
  visualization?: IVisualization;
};

const SingleValue = ({ visualization }: SingleValueProps) => {
  const { isLoading, isSuccess, data, isError, error } =
    useVisualization(visualization);
  return (
    <Stack w="100%" h="100%">
      {isLoading && <Spinner />}
      {isSuccess && (
        <Plot
          data={[
            {
              type: "indicator",
              mode: "number",
              value: processSingleValuedSQLViews(data),
            },
          ]}
          layout={{
            margin: { t: 0, r: 0, l: 0, b: 0, pad: 0 },
            autosize: true,
          }}
          style={{ width: "100%", height: "100%" }}
          config={{ displayModeBar: false, responsive: true }}
        />
      )}
      {isError && <Box>{JSON.stringify(error)}</Box>}
    </Stack>
  );
};
export default SingleValue;

import { Box, Spinner, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import Plot from "react-plotly.js";
import { IVisualization } from "../../interfaces";
import { useVisualization } from "../../Queries";
import { $indicators, $dataSources } from "../../Store";
import { processSingleValuedSQLViews } from "../processors";

type SingleValueProps = {
  visualization: IVisualization;
  valueformat?: string;
  prefix?: string;
  suffix?: string;
  valueSize?: number | undefined;
  titleSize?: number | undefined;
  valueColor?: string;
  titleColor?: string;
};

const SingleValue = ({
  visualization,
  valueformat,
  prefix,
  suffix,
  valueSize,
  titleSize,
  valueColor,
  titleColor,
}: SingleValueProps) => {
  const indicators = useStore($indicators);
  const dataSources = useStore($dataSources);
  const { isLoading, isSuccess, data, isError, error } = useVisualization(
    visualization,
    indicators,
    dataSources
  );
  return (
    <Stack w="100%" h="100%" overflow="auto">
      {isLoading && <Spinner />}
      {isSuccess && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {isError && <Box>{JSON.stringify(error)}</Box>}
    </Stack>
  );
};
export default SingleValue;

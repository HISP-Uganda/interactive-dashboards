import { Spinner, Stack } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { LocationGenerics } from "../../interfaces";
import { useVisualizationDatum } from "../../Queries";
import { $store } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import Indicator from "./Indicator";

export default function IndicatorForm() {
  const {
    params: { indicatorId },
  } = useMatch<LocationGenerics>();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error } = useVisualizationDatum(
    indicatorId,
    store.systemId
  );
  return (
    <Stack
      p={`${generalPadding}px`}
      bgColor="white"
      flex={1}
      h={otherHeight}
      maxH={otherHeight}
      justifyContent="center"
      justifyItems="center"
      alignContent="center"
      alignItems="center"
      w="100%"
    >
      {isLoading && <Spinner />}
      {isSuccess && <Indicator />}
      {isError && <pre>{JSON.stringify(error)}</pre>}
    </Stack>
  );
}

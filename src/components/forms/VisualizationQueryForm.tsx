import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { datumAPi } from "../../Events";
import { IData, LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createVisualizationQuery } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import LoadingIndicator from "../LoadingIndicator";
import VisualizationQuery from "./VisualizationQuery";

export default function VisualizationQueryForm() {
    const {
        params: { visualizationQueryId },
    } = useMatch<LocationGenerics>();
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error } = useSingleNamespace<IData>(
        storage,
        visualizationQueryId,
        store.systemId,
        "i-visualization-queries",
        datumAPi.set,
        createVisualizationQuery(visualizationQueryId)
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
            {isLoading && <LoadingIndicator />}
            {isSuccess && <VisualizationQuery />}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
}

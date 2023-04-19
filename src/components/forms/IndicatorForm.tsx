import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { LocationGenerics } from "../../interfaces";
import { useVisualizationDatum } from "../../Queries";
import { $store, $settings } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import Indicator from "./Indicator";
import LoadingIndicator from "../LoadingIndicator";

export default function IndicatorForm() {
    const {
        params: { indicatorId },
    } = useMatch<LocationGenerics>();
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error } = useVisualizationDatum(
        storage,
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
            {isLoading && <LoadingIndicator />}
            {isSuccess && <Indicator />}
            {isError && <Text>No data/Error occurred</Text>}
        </Stack>
    );
}

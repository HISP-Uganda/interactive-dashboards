import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { indicatorApi } from "../../Events";
import { IIndicator, LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createIndicator } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import LoadingIndicator from "../LoadingIndicator";
import Indicator from "./Indicator";

export default function IndicatorForm() {
    const {
        params: { indicatorId },
        search: { action },
    } = useMatch<LocationGenerics>();
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error } =
        useSingleNamespace<IIndicator>(
            storage,
            indicatorId,
            store.systemId,
            "i-indicators",
            action,
            indicatorApi.setIndicator,
            createIndicator(indicatorId)
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
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
}

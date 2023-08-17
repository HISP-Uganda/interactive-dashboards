import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { presentationApi } from "../../Events";
import { IPresentation, LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createPresentation } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import LoadingIndicator from "../LoadingIndicator";
import Presentation from "./Presentation";

export default function PresentationForm() {
    const {
        params: { presentationId },
        search: { action },
    } = useMatch<LocationGenerics>();
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error } =
        useSingleNamespace<IPresentation>(
            storage,
            presentationId,
            store.systemId,
            "i-presentations",
            action,
            presentationApi.setPresentation,
            createPresentation(presentationId)
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
            {isSuccess && <Presentation />}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
}

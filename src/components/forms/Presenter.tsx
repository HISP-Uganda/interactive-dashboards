import { Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import React from "react";
import { presentationApi } from "../../Events";
import { IPresentation, LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createPresentation } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import Show from "./Show";
import Show3 from "./Show3";

export default function Presenter() {
    const {
        params: { presentationId },
    } = useMatch<LocationGenerics>();
    const store = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error } =
        useSingleNamespace<IPresentation>(
            storage,
            presentationId,
            store.systemId,
            "i-presentations",
            "view",
            presentationApi.setPresentation,
            createPresentation(presentationId)
        );

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <Text>{error?.message}</Text>;
    if (isSuccess) return <Show3 />;
    return null;
}

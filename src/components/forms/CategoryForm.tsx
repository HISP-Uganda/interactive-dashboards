import { Stack, Text } from "@chakra-ui/react";
import { useMatch, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { categoryApi } from "../../Events";
import { LocationGenerics } from "../../interfaces";
import { useSingleNamespace } from "../../Queries";
import { $settings, $store, createCategory } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import LoadingIndicator from "../LoadingIndicator";
import Category from "./Category";

export default function CategoryForm() {
    const { storage } = useStore($settings);
    const store = useStore($store);
    const {
        params: { categoryId },
        search: { action },
    } = useMatch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error } = useSingleNamespace(
        storage,
        categoryId,
        store.systemId,
        "i-categories",
        action,
        categoryApi.setCategory,
        createCategory(categoryId)
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
            {isSuccess && <Category />}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
}

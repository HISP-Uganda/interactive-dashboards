import { Stack, Text } from "@chakra-ui/react";

import { useMatch } from "@tanstack/react-location";
import { LocationGenerics } from "../../interfaces";
import { useCategory } from "../../Queries";
import { generalPadding, otherHeight } from "../constants";
import Category from "./Category";
import LoadingIndicator from "../LoadingIndicator";
import { useStore } from "effector-react";
import { $settings } from "../../Store";
export default function CategoryForm() {
    const { storage } = useStore($settings);
    const {
        params: { categoryId },
    } = useMatch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error } = useCategory(
        storage,
        categoryId
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
            {isError && <Text>No data/Error occurred</Text>}
        </Stack>
    );
}

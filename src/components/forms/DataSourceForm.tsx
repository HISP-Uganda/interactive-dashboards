import { Stack, Text } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { LocationGenerics } from "../../interfaces";
import { useDataSource } from "../../Queries";
import { generalPadding, otherHeight } from "../constants";
import DataSource from "./DataSource";
import LoadingIndicator from "../LoadingIndicator";
import { useStore } from "effector-react";
import { $settings } from "../../Store";

export default function DataSourceForm() {
    const { storage } = useStore($settings);
    const {
        params: { dataSourceId },
    } = useMatch<LocationGenerics>();
    const { isLoading, isSuccess, isError, error } = useDataSource(
        storage,
        dataSourceId
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
            {isSuccess && <DataSource />}
            {isError && <pre>{JSON.stringify(error)}</pre>}
        </Stack>
    );
}

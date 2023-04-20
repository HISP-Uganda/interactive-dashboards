import { Flex, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { useDashboards } from "../../Queries";
import { $dashboard, $store } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { LocationGenerics } from "../../interfaces";

export default function DashboardList() {
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        store.systemId
    );
    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && (
                <Stack spacing="40px" p="5px">
                    {data.map((d) => (
                        <Flex
                            alignItems="center"
                            key={d.id}
                            gap="5"
                            pt="1"
                            pl="2"
                            borderRadius="lg"
                            fontSize="lg"
                            m="2"
                            cursor="pointer"
                            _hover={{ bgColor: "yellow.50", color: "black" }}
                            bgColor={dashboard.id === d.id ? "yellow.300" : ""}
                            // color={dashboard.id === d.id ? "gray.500" : ""}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate({
                                    to: `/dashboards/${d.id}`,
                                    search,
                                });
                            }}
                        >
                            {d.name}
                        </Flex>
                    ))}
                </Stack>
            )}

            {isError && <Text>No data/Error occurred</Text>}
        </>
    );
}

import { useEffect } from "react";
import { Key } from "react";
import { Stack, Flex, Text } from "@chakra-ui/react";
import { Navigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { setShowSider } from "../Events";
import { $store } from "../Store";

export default function Home() {
    const store = useStore($store);
    return (
        <Stack>
            {store.isAdmin ? (
                <Navigate to="/settings/data-sources" />
            ) : store.selectedDashboard ? (
                <Navigate
                    to={`/dashboards/${store.selectedDashboard}`}
                    search={{
                        category: store.selectedCategory,
                        periods: store.periods.map((i) => i.id),
                        organisations: store.organisations.map((k: Key) =>
                            String(k)
                        ),
                        groups: store.groups,
                        levels: store.levels,
                    }}
                />
            ) : (
                <Flex
                    w="100vw"
                    alignItems="center"
                    justifyContent="center"
                    justifyItems="center"
                    alignContent="center"
                    h="calc(100vh - 48px)"
                >
                    <Text fontSize="3vh">
                        No dashboards have been created yet
                    </Text>
                </Flex>
            )}
        </Stack>
    );
}

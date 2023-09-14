import { Flex, Stack, Text } from "@chakra-ui/react";
import { Navigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { Key } from "react";
import { $store, $settings } from "../Store";
import { LocationGenerics } from "../interfaces";

export default function Home() {
    const store = useStore($store);
    const settings = useStore($settings);
    return (
        <Stack>

            {store.isAdmin ? (
                <Navigate to="/settings/data-sources" />
            ) : settings.defaultDashboard ? (
                settings.template ? (
                    <Navigate<LocationGenerics>
                        to={`/templates/${settings.template}/${settings.defaultDashboard}`}
                        search={{
                            category: store.selectedCategory,
                            periods: store.periods.map((i) => String(i.id)),
                            organisations: store.organisations.map((k: Key) =>
                                String(k)
                            ),
                            groups: store.groups,
                            levels: store.levels,
                            action: "update",
                        }}
                    />
                ) : (
                        <Navigate<LocationGenerics>
                            to={`/dashboards/${settings.defaultDashboard}`}
                            search={{
                                category: store.selectedCategory,
                                periods: store.periods.map((i) => String(i.id)),
                                organisations: store.organisations.map((k: Key) =>
                                    String(k)
                                ),
                                groups: store.groups,
                                levels: store.levels,
                            }}
                        />
                    )
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

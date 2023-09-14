import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { groupBy, orderBy } from "lodash";
import React from "react";
import { ChartProps, LocationGenerics } from "../../interfaces";
import { useCategoryList } from "../../Queries";
import { $settings, $store, $path } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import NavItem from "../NavItem";
export default function CategoryList({ visualization }: ChartProps) {
    const store = useStore($store);
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    const settings = useStore($settings);
    const path = useStore($path);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } = useCategoryList(
        storage,
        store.systemId
    );
    const type = visualization.properties["type"] || "list";

    const displays: { [key: string]: React.ReactNode } = {
        list: (
            <Stack spacing="10px" p="5px" overflow="auto">
                {orderBy(data?.categories, "order")
                    .map((category) => {
                        const groupedDashboards = groupBy(
                            data?.dashboards.filter(
                                ({ published }) => store.isAdmin || published
                            ),
                            "category"
                        );
                        return {
                            ...category,
                            dashboards: groupedDashboards[category.id] || [],
                        };
                    })
                    .filter(({ dashboards }) => dashboards.length > 0)
                    .map((value) => {
                        return <NavItem option={value} key={value.id} />;
                    })}
            </Stack>
        ),
        accordion: (
            <Accordion w="100%" h="100%" allowMultiple>
                {orderBy(data?.categories, "order")
                    .map((category) => {
                        const groupedDashboards = groupBy(
                            data?.dashboards.filter(
                                ({ published }) => store.isAdmin || published
                            ),
                            "category"
                        );
                        return {
                            ...category,
                            dashboards: groupedDashboards[category.id] || [],
                        };
                    })
                    .filter(({ dashboards }) => dashboards.length > 0)
                    .map((value) => {
                        let current = "./";
                        if (settings.template) {
                            current = path;
                        }
                        return (
                            <AccordionItem key={value.id}>
                                <h2>
                                    <AccordionButton>
                                        <Box
                                            as="span"
                                            flex="1"
                                            textAlign="left"
                                        >
                                            {value.name}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel>
                                    {value.dashboards.map((d) => (
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
                                            _hover={{
                                                bgColor: "teal",
                                                color: "white",
                                                transform: "scale(1.1)",
                                            }}
                                            _active={{
                                                bgColor: "teal",
                                                color: "white",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate({
                                                    to: `${current}${d.id}`,
                                                    search,
                                                });
                                            }}
                                        >
                                            {d.name}
                                        </Flex>
                                    ))}
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}
            </Accordion>
        ),
        tree: <pre>{JSON.stringify(visualization, null, 2)}</pre>,
    };

    return (
        <Stack w="100%" h="100%" bg={visualization.properties["layout.bg"]}>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && displays[type]}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
}

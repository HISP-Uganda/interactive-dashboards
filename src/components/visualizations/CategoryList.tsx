import React from "react";
import {
    Stack,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { groupBy } from "lodash";
import { useDashboards } from "../../Queries";
import { $categoryOptions, $store, $settings } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import NavItem from "../NavItem";
import { ChartProps, LocationGenerics } from "../../interfaces";
import { useNavigate, useSearch } from "@tanstack/react-location";
export default function CategoryList({ visualization }: ChartProps) {
    const store = useStore($store);
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();

    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } = useDashboards(
        storage,
        store.systemId
    );
    const categoryOptions = useStore($categoryOptions);
    const type = visualization.properties["type"] || "list";

    const displays: { [key: string]: React.ReactNode } = {
        list: (
            <Stack spacing="10px" p="5px" overflow="auto">
                {categoryOptions
                    .map((category) => {
                        const groupedDashboards = groupBy(data, "category");
                        return {
                            ...category,
                            dashboards: groupedDashboards[category.value] || [],
                        };
                    })
                    .filter(({ dashboards }) => dashboards.length > 0)
                    .map((value) => {
                        return <NavItem option={value} key={value.value} />;
                    })}
            </Stack>
        ),
        accordion: (
            <Accordion w="100%" h="100%" allowMultiple>
                {categoryOptions
                    .map((category) => {
                        const groupedDashboards = groupBy(data, "category");
                        return {
                            ...category,
                            dashboards: groupedDashboards[category.value] || [],
                        };
                    })
                    .filter(({ dashboards }) => dashboards.length > 0)
                    .map((value) => {
                        return (
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box
                                            as="span"
                                            flex="1"
                                            textAlign="left"
                                        >
                                            {value.label}
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
                                                    to: `/dashboards/${d.id}`,
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
    };

    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && displays[type]}
            {isError && <Text>No data/Error occurred</Text>}
        </>
    );
}

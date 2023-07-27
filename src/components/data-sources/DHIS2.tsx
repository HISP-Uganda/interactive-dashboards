import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useState } from "react";
import { useElementSize } from "usehooks-ts";
import { useDimensions } from "../../Queries";
import { $currentDataSource, $visualizationQuery } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";
import DataElementGroups from "./DataElementGroups";
import DataElementGroupSets from "./DataElementGroupSets";
import DataElements from "./DataElements";
import Dimension from "./Dimension";
import Indicators from "./Indicators";
import OrganizationUnitGroups from "./OrganisationUnitGroups";
import OrganizationUnitGroupSets from "./OrganisationUnitGroupSets";
import OrganizationUnitLevels from "./OrganisationUnitLevels";
import OrgUnitTree from "./OrgUnitTree";
import Periods from "./Periods";
import ProgramIndicators from "./ProgramIndicators";
import SQLViews from "./SQLViews";
import DHIS2API from "./DHIS2API";
import DHIS2Visualizations from "./DHIS2Visualizations";

const DHIS2 = () => {
    const currentDataSource = useStore($currentDataSource);
    const visualizationQuery = useStore($visualizationQuery);
    const { error, data, isError, isLoading, isSuccess } = useDimensions(
        visualizationQuery.dataSource?.isCurrentDHIS2 || false,
        currentDataSource
    );
    const [active, setActive] = useState<string>("");

    const list = [
        {
            id: "1",
            name: "Indicators",
            element: <Indicators />,
        },
        {
            id: "2",
            name: "Indicator Groups",
            element: "",
        },
        {
            id: "3",
            name: "Indicator Group Sets",
            element: "",
        },
        {
            id: "4",
            name: "Program Indicators",
            element: <ProgramIndicators />,
        },
        {
            id: "5",
            name: "Data Elements",
            element: <DataElements />,
        },
        {
            id: "6",
            name: "Data Element Groups",
            element: <DataElementGroups />,
        },
        {
            id: "7",
            name: "Data Element Group Sets",
            element: <DataElementGroupSets />,
        },
        {
            id: "8",
            name: "Organisations",
            element: <OrgUnitTree />,
        },
        {
            id: "9",
            name: "Organisation Groups",
            element: <OrganizationUnitGroups />,
        },
        {
            id: "10",
            name: "Organisation Group Sets",
            element: <OrganizationUnitGroupSets />,
        },
        {
            id: "11",
            name: "Organisation Level",
            element: <OrganizationUnitLevels />,
        },
        {
            id: "12",
            name: "Period",
            element: <Periods />,
        },
    ];
    const [squareRef, { width, height }] = useElementSize();

    return (
        <Stack w="100%" h="100%">
            {isLoading && <LoadingIndicator />}
            {isSuccess && visualizationQuery.type === "ANALYTICS" && (
                <Stack w="100%" h="100%">
                    <Flex
                        gap="5px"
                        flexWrap="wrap"
                        bgColor="white"
                        p="5px"
                        alignContent="flex-start"
                    >
                        {list.map(({ id, name }) => (
                            <Button
                                key={id}
                                cursor="pointer"
                                variant="outline"
                                colorScheme={active === id ? "teal" : "gray"}
                                onClick={() => setActive(() => id)}
                            >
                                {name}
                            </Button>
                        ))}
                        {data?.map((item: any) => (
                            <Button
                                key={item.id}
                                cursor="pointer"
                                variant="outline"
                                colorScheme={
                                    active === item.id ? "teal" : "gray"
                                }
                                onClick={() => setActive(() => item.id)}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Flex>
                    <Stack w="100%" h="100%" ref={squareRef}>
                        {list.map(
                            ({ id, element }) => id === active && element
                        )}
                        {data?.map(
                            (item: any) =>
                                item.id === active && (
                                    <Dimension
                                        key={item.id}
                                        dimensionItem={item}
                                    />
                                )
                        )}
                    </Stack>
                </Stack>
            )}
            {visualizationQuery.type === "SQL_VIEW" && <SQLViews />}
            {visualizationQuery.type === "API" && <DHIS2API />}
            {visualizationQuery.type === "VISUALIZATION" && (
                <DHIS2Visualizations />
            )}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
};

export default DHIS2;

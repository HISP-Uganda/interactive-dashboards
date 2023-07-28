import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useState } from "react";
import { useElementSize } from "usehooks-ts";
import { IDataSource } from "../../interfaces";
import { useDimensions } from "../../Queries";
import { $visualizationQuery } from "../../Store";
import { createAxios } from "../../utils/utils";
import LoadingIndicator from "../LoadingIndicator";
import DataElementGroups from "./DataElementGroups";
import DataElementGroupSets from "./DataElementGroupSets";
import DataElements from "./DataElements";
import DHIS2API from "./DHIS2API";
import Dimension from "./Dimension";
import Indicators from "./Indicators";
import OrganizationUnitGroups from "./OrganisationUnitGroups";
import OrganizationUnitGroupSets from "./OrganisationUnitGroupSets";
import OrganizationUnitLevels from "./OrganisationUnitLevels";
import OrgUnitTree from "./OrgUnitTree";
import Periods from "./Periods";
import ProgramIndicators from "./ProgramIndicators";
import SQLViews from "./SQLViews";

const DHIS2 = ({
    dataSource,
}: {
    dataSource: IDataSource | null | undefined;
}) => {
    const visualizationQuery = useStore($visualizationQuery);
    const api = createAxios(dataSource?.authentication);
    const isCurrentDHIS2 = dataSource?.isCurrentDHIS2;
    const { error, data, isError, isLoading, isSuccess } = useDimensions(
        isCurrentDHIS2,
        api
    );
    const [active, setActive] = useState<string>("");
    const list = [
        {
            id: "1",
            name: "Indicators",
            element: <Indicators api={api} isCurrentDHIS2={isCurrentDHIS2} />,
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
            element: (
                <ProgramIndicators api={api} isCurrentDHIS2={isCurrentDHIS2} />
            ),
        },
        {
            id: "5",
            name: "Data Elements",
            element: <DataElements api={api} isCurrentDHIS2={isCurrentDHIS2} />,
        },
        {
            id: "6",
            name: "Data Element Groups",
            element: (
                <DataElementGroups api={api} isCurrentDHIS2={isCurrentDHIS2} />
            ),
        },
        {
            id: "7",
            name: "Data Element Group Sets",
            element: (
                <DataElementGroupSets
                    api={api}
                    isCurrentDHIS2={isCurrentDHIS2}
                />
            ),
        },
        {
            id: "8",
            name: "Organisations",
            element: <OrgUnitTree api={api} isCurrentDHIS2={isCurrentDHIS2} />,
        },
        {
            id: "9",
            name: "Organisation Groups",
            element: (
                <OrganizationUnitGroups
                    api={api}
                    isCurrentDHIS2={isCurrentDHIS2}
                />
            ),
        },
        {
            id: "10",
            name: "Organisation Group Sets",
            element: (
                <OrganizationUnitGroupSets
                    api={api}
                    isCurrentDHIS2={isCurrentDHIS2}
                />
            ),
        },
        {
            id: "11",
            name: "Organisation Level",
            element: (
                <OrganizationUnitLevels
                    api={api}
                    isCurrentDHIS2={isCurrentDHIS2}
                />
            ),
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
            {visualizationQuery.type === "SQL_VIEW" && (
                <SQLViews api={api} isCurrentDHIS2={isCurrentDHIS2} />
            )}
            {visualizationQuery.type === "API" && <DHIS2API />}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
};

export default DHIS2;

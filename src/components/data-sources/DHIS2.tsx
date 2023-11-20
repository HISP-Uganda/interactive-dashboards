import { Box, Button, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { useState } from "react";
import { useElementSize } from "usehooks-ts";
import { datumAPi } from "../../Events";
import { IDataSource, Option } from "../../interfaces";
import { useDimensions } from "../../Queries";
import { $visualizationQuery } from "../../Store";
import { createAxios, createOptions } from "../../utils/utils";
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

const availableOptions: Option[] = createOptions([
    "SUM",
    "AVERAGE",
    "AVERAGE_SUM_ORG_UNIT",
    "LAST",
    "LAST_AVERAGE_ORG_UNIT",
    "COUNT",
    "STDDEV",
    "VARIANCE",
    "MIN",
    "MAX",
]);

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
                    <Stack direction="row" alignItems="center" flex={1}>
                        <Text>Aggregation Type</Text>
                        <Box w="20%">
                            <Select<Option, false, GroupBase<Option>>
                                value={availableOptions.find(
                                    (pt) =>
                                        pt.value ===
                                        visualizationQuery.aggregationType
                                )}
                                onChange={(e) =>
                                    datumAPi.changeAttribute({
                                        attribute: "aggregationType",
                                        value: e?.value,
                                    })
                                }
                                options={availableOptions}
                                isClearable
                            />
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" flex={1}>
                        <Text
                            mt="5px"
                            color="blue.400"
                            fontWeight="bold"
                            fontSize="lg"
                        >
                            Main Query Dimensions
                        </Text>
                    </Stack>
                    <Flex gap="5px" bgColor="white" p="5px">
                        <Grid
                            templateColumns="repeat(4, 1fr)"
                            gap="10px"
                            width="100%"
                            height="100%"
                        >
                            {list.map(({ id, name }) => (
                                <Button
                                    key={id}
                                    cursor="pointer"
                                    variant="outline"
                                    colorScheme={
                                        active === id ? "teal" : "gray"
                                    }
                                    onClick={() => setActive(() => id)}
                                    width="100%"
                                    justifyContent="left"
                                    justifyItems="left"
                                >
                                    {name}
                                </Button>
                            ))}
                        </Grid>
                    </Flex>
                    <Stack direction="row" alignItems="center" flex={1}>
                        <Text
                            mt="5px"
                            color="blue.400"
                            fontWeight="bold"
                            fontSize="lg"
                        >
                            Other Query Dimensions
                        </Text>
                    </Stack>
                    <Flex gap="5px" bgColor="white" p="5px">
                        <Grid
                            templateColumns="repeat(4, 1fr)"
                            gap="10px"
                            width="100%"
                            height="100%"
                        >
                            {data?.map((item: any) => (
                                <Button
                                    key={item.id}
                                    cursor="pointer"
                                    variant="outline"
                                    colorScheme={
                                        active === item.id ? "teal" : "gray"
                                    }
                                    onClick={() => setActive(() => item.id)}
                                    width="100%"
                                    justifyContent="left"
                                    justifyItems="left"
                                >
                                    {item.name}
                                </Button>
                            ))}
                        </Grid>
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

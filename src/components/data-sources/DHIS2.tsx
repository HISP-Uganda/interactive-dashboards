import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useState } from "react";
import { useElementSize } from "usehooks-ts";
import { IndicatorProps } from "../../interfaces";
import { useDimensions } from "../../Queries";
import { $currentDataSource, $hasDHIS2 } from "../../Store";
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

const DHIS2 = ({ onChange, denNum, changeQuery }: IndicatorProps) => {
    const hasDHIS2 = useStore($hasDHIS2);
    const currentDataSource = useStore($currentDataSource);
    const { error, data, isError, isLoading, isSuccess } = useDimensions(
        hasDHIS2,
        currentDataSource
    );
    const [active, setActive] = useState<string>("");

    const list = [
        {
            id: "1",
            name: "Indicators",
            element: <Indicators denNum={denNum} onChange={onChange} />,
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
            element: <ProgramIndicators denNum={denNum} onChange={onChange} />,
        },
        {
            id: "5",
            name: "Data Elements",
            element: <DataElements denNum={denNum} onChange={onChange} />,
        },
        {
            id: "6",
            name: "Data Element Groups",
            element: <DataElementGroups denNum={denNum} onChange={onChange} />,
        },
        {
            id: "7",
            name: "Data Element Group Sets",
            element: (
                <DataElementGroupSets denNum={denNum} onChange={onChange} />
            ),
        },
        {
            id: "8",
            name: "Organisations",
            element: <OrgUnitTree denNum={denNum} onChange={onChange} />,
        },
        {
            id: "9",
            name: "Organisation Groups",
            element: (
                <OrganizationUnitGroups denNum={denNum} onChange={onChange} />
            ),
        },
        {
            id: "10",
            name: "Organisation Group Sets",
            element: (
                <OrganizationUnitGroupSets
                    denNum={denNum}
                    onChange={onChange}
                />
            ),
        },
        {
            id: "11",
            name: "Organisation Level",
            element: (
                <OrganizationUnitLevels denNum={denNum} onChange={onChange} />
            ),
        },
        {
            id: "12",
            name: "Period",
            element: <Periods denNum={denNum} onChange={onChange} />,
        },
    ];
    const [squareRef, { width, height }] = useElementSize();

    return (
        <Stack w="100%" h="100%">
            {isLoading && <LoadingIndicator />}
            {isSuccess && denNum?.type === "ANALYTICS" && (
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
                                        denNum={denNum}
                                        onChange={onChange}
                                        dimensionItem={item}
                                    />
                                )
                        )}
                    </Stack>
                </Stack>
            )}
            {denNum?.type === "SQL_VIEW" && (
                <SQLViews
                    denNum={denNum}
                    onChange={onChange}
                    changeQuery={changeQuery}
                />
            )}
            {/* {denNum?.type === "OTHER" && <Text>Coming soon</Text>} */}
            {isError && <Text>{error?.message}</Text>}
        </Stack>
    );
};

export default DHIS2;

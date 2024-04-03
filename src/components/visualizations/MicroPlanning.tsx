import React, { useEffect, useState } from "react";
import {
    Text,
    Stack,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { ChartProps } from "../../interfaces";
import { useDataEngine } from "@dhis2/app-runtime";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { processTable } from "../processors";
import { color } from "html2canvas/dist/types/css/types/color";

// interface OrgUnit {
//   id: string;
//   displayName: string;
// }

export const useOrgUnits = () => {
    const engine = useDataEngine();
    return useQuery("organisationUnits", async () => {
        const response = await engine.query({
            organisationUnits: {
                resource: "organisationUnits",
                params: {
                    fields: ["id", "displayName"],
                    //   filter: ["level:eq:4"],
                    paging: false,
                    level: "4",
                },
            },
        });
        return response.organisationUnits;
    });
};

export default function MicroPlanning({ visualization, data }: ChartProps) {
    const [userInput, setUserInput] = useState(5);
    const [userInput1, setUserInput1] = useState(5);
    const [userInput2, setUserInput2] = useState(90);
    const [userInput3, setUserInput3] = useState(1);

    const processedData = processTable(
        data,
        ["ou"],
        ["dx"],
        [],
        "sum",
        [],
        "value",
        {},
        visualization.properties
    );

    return (
        <Stack overflowX="auto">
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

            <Table
                width="80%"
                borderWidth="1px"
                size="sm"
                colorScheme="teal"
                borderColor="black"
            >
                <Thead bg="gray.100" color="black" fontWeight="extrabold">
                    <Tr>
                        <Th colSpan={8} border="1px solid black">
                            <Text my="7px">
                                Goal: Increase immunisation coverage to at least
                                90% with all vaccines in every service area
                            </Text>
                        </Th>
                        <Th colSpan={7} border="1px solid black">
                            <Stack direction="row">
                                <Text my="20px">DPT1 coverage : </Text>
                                <Td>
                                    <NumberInput
                                        bgColor="#ffff"
                                        step={1}
                                        defaultValue={90}
                                        min={90}
                                        max={100}
                                        onChange={(valueString) => {
                                            setUserInput2(() =>
                                                Number(valueString)
                                            );
                                        }}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Td>
                            </Stack>
                        </Th>
                        <Th colSpan={6} border="1px solid black">
                            <Stack direction="row">
                                <Text my="20px">Drop-out Rate : </Text>
                                <Td>
                                    <NumberInput
                                        bgColor="#ffff"
                                        step={1}
                                        defaultValue={1}
                                        min={0}
                                        max={10}
                                        onChange={(valueString) => {
                                            setUserInput3(
                                                Number(
                                                    valueString.replace(
                                                        /,/g,
                                                        ""
                                                    )
                                                ) || 0
                                            );
                                        }}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Td>
                            </Stack>
                        </Th>
                    </Tr>

                    <Tr>
                        <Th border="1px solid black">
                            <Text>Area Name / Service Delivery Point</Text>
                        </Th>
                        <Th border="1px solid black">
                            <Text>Total Population Previous FY</Text>
                        </Th>
                        <Th border="1px solid black">
                            <Text>Target Population Live births (4.85%)</Text>
                        </Th>
                        <Th border="1px solid black">
                            <Text>Target Population below 1 yr (4.3%)</Text>
                        </Th>
                        <Th colSpan={4} border="1px solid black">
                            <Text>Children Immunised</Text>
                        </Th>
                        <Th colSpan={4} border="1px solid black">
                            <Text>Immunisation Coverage (%)</Text>
                        </Th>
                        <Th colSpan={3} border="1px solid black">
                            <Text>Unimmunized (No.)</Text>
                        </Th>
                        <Th colSpan={2} border="1px solid black">
                            <Text>Drop-out rates (%)</Text>
                        </Th>
                        <Th colSpan={2} border="1px solid black">
                            <Text>Identify problem (see table 2*)</Text>
                        </Th>
                        <Th border="1px solid black">
                            <Text>
                                Categorize problem according to table 2**
                            </Text>
                        </Th>
                        <Th border="1px solid black">
                            <Text>Prioritize area</Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr fontWeight="semibold">
                        <Td border="1px solid black">
                            <Text>A</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>B</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>C</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>D</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text></Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>F</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>G</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>H</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>I</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>J</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>K</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>L</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>M</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>N</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>O</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>P</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>Q</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>R</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>S</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>T</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>U</Text>
                        </Td>
                    </Tr>
                    <Tr fontWeight="semibold">
                        <Td border="1px solid black">
                            <Text>Child Immunisation</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text></Text>
                        </Td>
                        <Td border="1px solid black">
                            <NumberInput
                                step={1}
                                defaultValue={5}
                                min={1}
                                max={12}
                                onChange={(valueString) => {
                                    setUserInput(
                                        Number(valueString.replace(/,/g, "")) ||
                                            0
                                    );
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Td>
                        <Td border="1px solid black">
                            <NumberInput
                                step={1}
                                defaultValue={5}
                                min={1}
                                max={12}
                                onChange={(valueString) => {
                                    setUserInput1(
                                        Number(valueString.replace(/,/g, "")) ||
                                            0
                                    );
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Td>
                        <Td border="1px solid black">
                            <Text>BCG</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT1</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT3</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>MR1</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>BCG</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT1</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT3</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>MR1</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>Zero Dose</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT3</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>MR1</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT1-DPT3</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>DPT1-MR1</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>Access</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>Utilization</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>Category 1,2,3 or 4</Text>
                        </Td>
                        <Td border="1px solid black">
                            <Text>Priority 1,2,3</Text>
                        </Td>
                    </Tr>
                    {processedData.finalData.map((orgUnit) => {
                        const totalPopulation = Math.floor(
                            orgUnit["eHKadEd89Np"].replace(/,/g, "")
                        );

                        const totalPopulationLiveBirths =
                            Math.floor(
                                ((Number(
                                    orgUnit["eHKadEd89Np"].replace(/,/g, "")
                                ) *
                                    0.0485) /
                                    12) *
                                    userInput
                            ) || 0;

                        const totalPopulationBelowOneYear =
                            Math.floor(
                                ((Number(
                                    orgUnit["eHKadEd89Np"].replace(/,/g, "")
                                ) *
                                    0.043) /
                                    12) *
                                    userInput1
                            ) || 0;

                        const childrenImmunizedBCG1 = Math.floor(
                            orgUnit["qxXm4iCRELh"]
                        );
                        const childrenImmunizedDPT1 = Math.floor(
                            orgUnit["TY3Nmc0EL3U"]
                        );
                        const childrenImmunizedDPT3 = Math.floor(
                            orgUnit["t2CpG3vv7sO"]
                        );
                        const childrenImmunizedMR1 = Math.floor(
                            orgUnit["Rq3LICjHeiM"]
                        );
                        const coverageBCG = (
                            (childrenImmunizedBCG1 /
                                totalPopulationLiveBirths) *
                            100
                        ).toFixed(2);
                        const coverageDPT1 = (
                            (childrenImmunizedDPT1 /
                                totalPopulationBelowOneYear) *
                            100
                        ).toFixed(2);
                        const coverageDPT3 = (
                            (childrenImmunizedDPT3 /
                                totalPopulationBelowOneYear) *
                            100
                        ).toFixed(2);
                        const coverageMR1 = (
                            (childrenImmunizedMR1 /
                                totalPopulationBelowOneYear) *
                            100
                        ).toFixed(2);
                        const zeroDose =
                            totalPopulationBelowOneYear - childrenImmunizedDPT1;
                        const unImmunizedDPT3 =
                            childrenImmunizedDPT1 - childrenImmunizedDPT3;
                        const unImmunizedMR1 =
                            childrenImmunizedDPT1 - childrenImmunizedMR1;
                        const dropOutRateDPT1ToDPT3 = (
                            ((childrenImmunizedDPT1 - childrenImmunizedDPT3) /
                                childrenImmunizedDPT1) *
                            100
                        ).toFixed(2);
                        const dropOutRateDPT1ToMR1 = (
                            ((childrenImmunizedDPT1 - childrenImmunizedMR1) /
                                childrenImmunizedDPT1) *
                            100
                        ).toFixed(2);

                        const dropOutRateDPT1ToMR1Numeric =
                            parseFloat(coverageDPT1);
                        const access =
                            dropOutRateDPT1ToMR1Numeric > userInput2
                                ? "Good"
                                : "Poor";

                        const dropOutRateDPT1ToDPT3Numeric = parseFloat(
                            dropOutRateDPT1ToDPT3
                        );
                        const utilization =
                            dropOutRateDPT1ToDPT3Numeric < userInput3 &&
                            dropOutRateDPT1ToDPT3Numeric > 0
                                ? "Good"
                                : "Poor";

                        const categoryValue = () => {
                            if (access === "Good" && utilization === "Good") {
                                return "Cat. 1";
                            } else if (
                                access === "Good" &&
                                utilization === "Poor"
                            ) {
                                return "Cat. 2";
                            } else if (
                                access === "Poor" &&
                                utilization === "Good"
                            ) {
                                return "Cat. 3";
                            } else if (
                                access === "Poor" &&
                                utilization === "Poor"
                            ) {
                                return "Cat. 4";
                            } else {
                                return "N/A";
                            }
                        };
                        //category Legends
                        const getCategoryBgColor = (
                            category: string
                        ): string => {
                            switch (category) {
                                case "Cat. 1":
                                    return "#2B7803";
                                case "Cat. 2":
                                    return "#A3F587";
                                case "Cat. 3":
                                    return "#FFFC00";
                                case "Cat. 4":
                                    return "#FF0000";
                                default:
                                    return "gray";
                            }
                        };
                        const priorityValue = () => {
                            if (categoryValue() === "Cat. 1") {
                                return "4";
                            } else if (categoryValue() === "Cat. 2") {
                                return "3";
                            } else if (categoryValue() === "Cat. 3") {
                                return "2";
                            } else if (categoryValue() === "Cat. 4") {
                                return "1";
                            }
                        };

                        //DropOut Legend
                        const getDropOutRateBgColor = (
                            value: number
                        ): string => {
                            if (value >= -100 && value < 0) {
                                return "#E3DDE3";
                            } else if (value >= 0 && value < 10) {
                                return "#4DAC26";
                            } else {
                                return "#F03B20";
                            }
                        };

                        const dropOutRateDPT1ToDPT3Value = parseFloat(
                            dropOutRateDPT1ToDPT3
                        );
                        const dropOutRateDPT1ToMR1DPT1Value =
                            parseFloat(dropOutRateDPT1ToMR1);

                        const bgColor = getDropOutRateBgColor(
                            dropOutRateDPT1ToDPT3Value
                        );
                        const bgColor2 = getDropOutRateBgColor(
                            dropOutRateDPT1ToMR1DPT1Value
                        );
                        // Coverage Legends
                        const getBgColor = (coverageValue: string): string => {
                            const value = parseFloat(coverageValue);

                            if (value < 50) {
                                return "#E31A1C";
                            } else if (value >= 50 && value < 80) {
                                return "#FFF200";
                            } else if (value >= 80 && value < 90) {
                                return "#24DE24";
                            } else {
                                return "#267B20";
                            }
                        };

                        const coverageValues: string[] = [
                            coverageBCG,
                            coverageDPT1,
                            coverageDPT3,
                            coverageMR1,
                        ];
                        const bgColors: string[] = [];

                        for (let i = 0; i < coverageValues.length; i++) {
                            bgColors.push(getBgColor(coverageValues[i]));
                        }

                        //Zero Dose Legends
                        const zeroDoseValue = zeroDose as number;
                        let zeroBgColor;
                        let color;

                        if (zeroDoseValue >= -100000 && zeroDoseValue < 100) {
                            zeroBgColor = "#FECC5C";
                        } else if (
                            zeroDoseValue >= 100 &&
                            zeroDoseValue < 2000
                        ) {
                            zeroBgColor = "#FD8D3C";
                            color = "black";
                        } else if (
                            zeroDoseValue >= 2000 &&
                            zeroDoseValue < 100000
                        ) {
                            zeroBgColor = "#BD0026";
                        } else {
                            zeroBgColor = "#DBDBDB";
                        }
                        return (
                            <Tr key={orgUnit["ou-name"]}>
                                <Td border="1px solid black">
                                    {orgUnit["ou-name"]}
                                </Td>
                                <Td border="1px solid black">
                                    {totalPopulation}
                                </Td>
                                <Td border="1px solid black">
                                    {totalPopulationLiveBirths}
                                </Td>
                                <Td border="1px solid black">
                                    {totalPopulationBelowOneYear}
                                </Td>
                                <Td border="1px solid black">
                                    {childrenImmunizedBCG1}
                                </Td>
                                <Td border="1px solid black">
                                    {childrenImmunizedDPT1}
                                </Td>
                                <Td border="1px solid black">
                                    {childrenImmunizedDPT3}
                                </Td>
                                <Td border="1px solid black">
                                    {childrenImmunizedMR1}
                                </Td>
                                <Td
                                    border="1px solid black"
                                    bgColor={bgColors[0]}
                                >
                                    {coverageBCG}%
                                </Td>
                                <Td
                                    border="1px solid black"
                                    bgColor={bgColors[1]}
                                >
                                    {coverageDPT1}%
                                </Td>
                                <Td
                                    border="1px solid black"
                                    bgColor={bgColors[2]}
                                >
                                    {coverageDPT3}%
                                </Td>
                                <Td
                                    border="1px solid black"
                                    bgColor={bgColors[3]}
                                >
                                    {coverageMR1}%
                                </Td>
                                <Td
                                    border="1px solid black"
                                    bgColor={zeroBgColor}
                                >
                                    {zeroDose}
                                </Td>
                                <Td border="1px solid black">
                                    {unImmunizedDPT3}
                                </Td>
                                <Td border="1px solid black">
                                    {unImmunizedMR1}
                                </Td>
                                <Td border="1px solid black" bgColor={bgColor}>
                                    {dropOutRateDPT1ToDPT3}%
                                </Td>
                                <Td border="1px solid black" bgColor={bgColor2}>
                                    {dropOutRateDPT1ToMR1}%
                                </Td>
                                <Td
                                    border="1px solid black"
                                    fontSize="xl"
                                    bgColor={
                                        access === "Good" ? "green.600" : "red"
                                    }
                                    color={
                                        access === "Good" ? "white" : "white"
                                    }
                                    fontWeight={
                                        access === "Good"
                                            ? "extrabold"
                                            : "extrabold"
                                    }
                                >
                                    {access}
                                </Td>
                                <Td
                                    border="1px solid black"
                                    fontSize="xl"
                                    bgColor={
                                        utilization === "Good"
                                            ? "green.600"
                                            : "red"
                                    }
                                    color={
                                        utilization === "Good"
                                            ? "white"
                                            : "white"
                                    }
                                    fontWeight={
                                        utilization === "Good"
                                            ? "extrabold"
                                            : "extrabold"
                                    }
                                >
                                    {utilization}
                                </Td>
                                <Td
                                    border="1px solid black"
                                    color="white"
                                    fontSize="xl"
                                    fontWeight="extrabold"
                                    bgColor={getCategoryBgColor(
                                        categoryValue()
                                    )}
                                >
                                    {categoryValue()}
                                </Td>
                                <Td
                                    border="1px solid black"
                                    color="white"
                                    fontSize="xl"
                                    fontWeight="extrabold"
                                    bgColor="blue.500"
                                >
                                    {priorityValue()}
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Stack>
    );
}

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
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { ChartProps } from "../../interfaces";
import { useDataEngine } from "@dhis2/app-runtime";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { processTable } from "../processors";

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
  //   const { isLoading, isError, isSuccess, data } = useOrgUnits();
  //   console.log(data);

  // console.log(useOrgUnits);

  //   if (isLoading) return <div>Loading...</div>;
  //   if (isError) return <div>Error fetching data</div>;
  //   if (isSuccess) {
  // const { organisationUnits } = data as Record<string, any>;
  // return (

  // );
  //   }

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
        <Thead bg="gray.200" color="black" fontWeight="extrabold">
          <Tr>
            <Th colSpan={21} border="1px solid black">
              <Text my="10px">
                Goal: Increase immunisation coverage to at least 90% with all
                vaccines in every service area
              </Text>
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
              <Text>Categorize problem according to table 2**</Text>
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
              <Text>E</Text>
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
              <Text>758727</Text>
            </Td>
            <Td border="1px solid black">
              <Text>3</Text>
            </Td>
            <Td border="1px solid black">
              <Text>5</Text>
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
          {processedData.finalData.map((orgUnit) => (
            <Tr key={orgUnit["ou-name"]}>
              <Td border="1px solid black">{orgUnit["ou-name"]}</Td>
              <Td border="1px solid black">{orgUnit["eHKadEd89Np"]}</Td>{" "}
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black">{orgUnit["qxXm4iCRELh"]}</Td>
              <Td border="1px solid black">{orgUnit["TY3Nmc0EL3U"]}</Td>
              <Td border="1px solid black">{orgUnit["t2CpG3vv7sO"]}</Td>
              <Td border="1px solid black">{orgUnit["Rq3LICjHeiM"]}</Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
              <Td border="1px solid black"></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  );
}

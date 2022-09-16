import {
  Button,
  Divider,
  Input,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import {
  changeVisualizationData,
  setIndicator,
  setVisualizationQueries,
} from "../../Events";
import { IIndicator } from "../../interfaces";
import { useVisualizationData } from "../../Queries";
import { $indicators, $indicator, createIndicator } from "../../Store";
import { AddIcon } from "@chakra-ui/icons";

const Indicators = () => {
  const navigate = useNavigate();
  const indicator = useStore($indicator);
  const indicators = useStore($indicators);
  const { isLoading, isSuccess, isError, error } = useVisualizationData();
  return (
    <Stack p="20px" bg="white">
      <Stack direction="row">
        {/* <Input placeholder='Search Visualization Data' width='50%' /> */}
        <Input
          value={indicator.name}
          placeholder="Search Visualization Data"
          width="50%"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            changeVisualizationData({
              attribute: "name",
              value: e.target.value,
            })
          }
        />
        <Spacer />
        <Button
          onClick={() => {
            const indicator = createIndicator();
            setVisualizationQueries([...indicators, indicator]);
            navigate({ to: `/indicators/${indicator.id}` });
          }}
          colorScheme="blue"
        >
          <AddIcon mr="2" />
          Add Visualization Data
        </Button>
      </Stack>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack
          direction="row"
          overflow="auto"
          h="calc(100vh - 300px)"
          spacing="10px"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Data Source</Th>
                <Th>Factor</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {indicators.map((indicator: IIndicator) => (
                <Tr
                  key={indicator.id}
                  cursor="pointer"
                  onClick={() => {
                    setIndicator(indicator);
                    navigate({
                      to: `/indicators/${indicator.id}`,
                      search: { edit: true },
                    });
                  }}
                >
                  <Td>{indicator.name}</Td>
                  <Td>{indicator.dataSource}</Td>
                  <Td>{indicator.factor}</Td>
                  <Td>{indicator.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      )}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Stack>
  );
};

export default Indicators;

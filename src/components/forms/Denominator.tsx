import {
  Button,
  Checkbox,
  Heading,
  Input,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-location";

import {
  changeDenominatorAttribute,
  changeDenominatorDimension,
  changeDenominatorExpressionValue,
} from "../../Events";
import { FormGenerics, Option } from "../../interfaces";
import { $dataSourceType, $indicator } from "../../Store";
import { getSearchParams, globalIds } from "../../utils/utils";
import { displayDataSourceType } from "../data-sources";

const availableOptions: Option[] = [
  { value: "SQL_VIEW", label: "SQL Views" },
  { value: "ANALYTICS", label: "Analytics" },
];
const Denominator = () => {
  const search = useSearch<FormGenerics>();
  const indicator = useStore($indicator);
  const dataSourceType = useStore($dataSourceType);
  const navigate = useNavigate();
  return (
    <Stack spacing="20px" p="20px" w="100%">
      <Stack>
        <Text>Numerator Name</Text>
        <Input
          value={indicator.denominator?.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            changeDenominatorAttribute({
              attribute: "name",
              value: e.target.value,
            })
          }
        />
      </Stack>
      <Stack>
        <Text>Numerator Description</Text>
        <Textarea
          value={indicator.denominator?.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            changeDenominatorAttribute({
              attribute: "description",
              value: e.target.value,
            })
          }
        />
      </Stack>
      {dataSourceType === "DHIS2" && (
        <Stack>
          <Text>Type</Text>
          <Select<Option, false, GroupBase<Option>>
            value={availableOptions.find(
              (pt) => pt.value === indicator.denominator?.type
            )}
            onChange={(e) =>
              changeDenominatorAttribute({
                attribute: "type",
                value: e?.value,
              })
            }
            options={availableOptions}
            isClearable
          />
        </Stack>
      )}

      {displayDataSourceType({
        dataSourceType,
        onChange: changeDenominatorDimension,
        denNum: indicator.denominator,
        changeQuery: changeDenominatorAttribute,
      })}

      {indicator.denominator?.type === "SQL_VIEW" && (
        <Table size="sm" textTransform="none">
          <Thead>
            <Tr py={1}>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Key
                </Heading>
              </Th>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Use Global Filter
                </Heading>
              </Th>
              <Th>
                <Heading as="h6" size="xs" textTransform="none">
                  Value
                </Heading>
              </Th>
            </Tr>
          </Thead>
          <Tbody py={10}>
            {getSearchParams(indicator.denominator.query).map((record) => (
              <Tr key={record}>
                <Td>
                  <Input readOnly value={record} />
                </Td>
                <Td>
                  <Checkbox
                    isChecked={
                      indicator.denominator?.expressions?.[record].isGlobal
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      changeDenominatorExpressionValue({
                        attribute: record,
                        value: "",
                        isGlobal: e.target.checked,
                      })
                    }
                  />
                </Td>
                <Td>
                  {indicator.denominator?.expressions?.[record].isGlobal ? (
                    <Select<Option, false, GroupBase<Option>>
                      value={globalIds.find(
                        (pt) =>
                          pt.value ===
                          indicator.denominator?.expressions?.[record].value
                      )}
                      onChange={(e) =>
                        changeDenominatorExpressionValue({
                          attribute: record,
                          value: e?.value || "",
                          isGlobal: true,
                        })
                      }
                      options={globalIds}
                      isClearable
                    />
                  ) : (
                    <Input
                      value={indicator.denominator?.expressions?.[record].value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeDenominatorExpressionValue({
                          attribute: record,
                          value: e.target.value,
                          isGlobal: false,
                        })
                      }
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <Stack direction="row">
        {/* <Button colorScheme="red">Cancel</Button> */}
        <Spacer />
        <Button onClick={() => navigate({ to: "/indicators/form", search })}>
          OK
        </Button>
      </Stack>
    </Stack>
  );
};

export default Denominator;

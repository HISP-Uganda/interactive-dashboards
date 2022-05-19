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
import { useNavigate } from "@tanstack/react-location";

import {
  changeNumeratorAttribute,
  changeNumeratorDimension,
  changeNumeratorExpressionValue,
} from "../../Events";
import { Option } from "../../interfaces";
import { $dataSourceType, $indicator } from "../../Store";
import { getSearchParams, globalIds } from "../../utils/utils";
import { displayDataSourceType } from "../data-sources";

const availableOptions: Option[] = [
  { value: "SQL_VIEW", label: "SQL Views" },
  { value: "ANALYTICS", label: "Analytics" },
];
const Numerator = () => {
  const [useGlobal, setUseGlobal] = useState<boolean>(false);
  const indicator = useStore($indicator);
  const dataSourceType = useStore($dataSourceType);
  const navigate = useNavigate();

  return (
    <Stack spacing="20px" p="20px" w="100%">
      <Stack>
        <Text>Numerator Name</Text>
        <Input
          value={indicator.numerator?.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            changeNumeratorAttribute({
              attribute: "name",
              value: e.target.value,
            })
          }
        />
      </Stack>
      <Stack>
        <Text>Numerator Description</Text>
        <Textarea
          value={indicator.numerator?.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            changeNumeratorAttribute({
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
              (pt) => pt.value === indicator.numerator?.type
            )}
            onChange={(e) =>
              changeNumeratorAttribute({
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
        onChange: changeNumeratorDimension,
        denNum: indicator.numerator,
        changeQuery: changeNumeratorAttribute,
      })}

      {indicator.numerator?.type === "SQL_VIEW" && (
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
            {getSearchParams(indicator.numerator.query).map((record) => (
              <Tr key={record}>
                <Td>
                  <Input readOnly value={record} />
                </Td>
                <Td>
                  <Checkbox
                    isChecked={useGlobal}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setUseGlobal(e.target.checked)
                    }
                  />
                </Td>
                <Td>
                  {useGlobal ? (
                    <Stack>
                      <Text>Global Filter</Text>
                      <Select<Option, false, GroupBase<Option>>
                        value={globalIds.find(
                          (pt) =>
                            pt.value ===
                            indicator.numerator?.expressions?.[record]
                        )}
                        onChange={(e) =>
                          changeNumeratorExpressionValue({
                            attribute: record,
                            value: e?.value || "",
                          })
                        }
                        options={globalIds}
                        isClearable
                      />
                    </Stack>
                  ) : (
                    <Input
                      value={indicator.numerator?.expressions?.[record]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeNumeratorExpressionValue({
                          attribute: record,
                          value: e.target.value,
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
        <Button onClick={() => navigate({ to: "/indicators/form" })}>OK</Button>
      </Stack>
    </Stack>
  );
};

export default Numerator;

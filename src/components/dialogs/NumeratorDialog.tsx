import {
  Box,
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import {
  addNumeratorExpression,
  changeNumeratorAttribute,
  changeNumeratorDimension,
  changeNumeratorExpressionValue,
} from "../../Events";
import { $dataSourceType, $indicator } from "../../Store";
import { generateUid } from "../../utils/uid";
import { displayDataSourceType } from "../data-sources";
const NumeratorDialog = () => {
  const [active, setActive] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const indicator = useStore($indicator);
  const dataSourceType = useStore($dataSourceType);
  return (
    <Stack>
      <Button onClick={onOpen}>Numerator</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent m="48px">
          <ModalHeader>Numerator</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="100%">
            <Stack spacing="20px">
              <Stack>
                <Text>Numerator Name</Text>
                <Input
                  value={indicator.numerator.name}
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
                  value={indicator.numerator.description}
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
                  <Select
                    value={indicator.numerator.type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      changeNumeratorAttribute({
                        attribute: "type",
                        value: e.target.value,
                      })
                    }
                  >
                    <option></option>
                    <option value="SQL_VIEW">SQL Views</option>
                    <option value="ANALYTICS">Analytics</option>
                  </Select>
                </Stack>
              )}

              {displayDataSourceType({
                dataSourceType,
                onChange: changeNumeratorDimension,
                denNum: indicator.numerator,
                changeQuery: changeNumeratorAttribute,
              })}

              {indicator.numerator.type === "SQL_VIEW" && (
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
                          Value
                        </Heading>
                      </Th>
                      <Th>
                        <Heading as="h6" size="xs" textTransform="none">
                          Options
                        </Heading>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody py={10}>
                    {indicator.numerator.expressions?.map((record) =>
                      active === record.id ? (
                        <Tr key={record.id}>
                          <Td>
                            <Input
                              value={record.key}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                changeNumeratorExpressionValue({
                                  id: record.id,
                                  attribute: "key",
                                  value: e.target.value,
                                })
                              }
                            />
                          </Td>
                          <Td>
                            <Input
                              value={record.value}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                changeNumeratorExpressionValue({
                                  id: record.id,
                                  attribute: "value",
                                  value: e.target.value,
                                })
                              }
                            />
                          </Td>
                          <Td>
                            <Button onClick={() => setActive("")}>Save</Button>
                          </Td>
                        </Tr>
                      ) : (
                        <Tr key={record.id}>
                          <Td>{record.key}</Td>
                          <Td>{record.value}</Td>
                          <Td>
                            <Stack spacing="5px" direction="row">
                              <Button>Edit</Button>
                              <Button colorScheme="red">Delete</Button>
                            </Stack>
                          </Td>
                        </Tr>
                      )
                    )}
                    <Tr>
                      <Td colSpan={3} textAlign="right">
                        <Box>
                          <Button
                            onClick={() => {
                              const id = generateUid();
                              setActive(id);
                              addNumeratorExpression({
                                id,
                                key: "",
                                value: "",
                                isGlobal: false,
                              });
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row">
              <Button colorScheme="blue" onClick={onClose}>
                Save Numerator
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default NumeratorDialog;

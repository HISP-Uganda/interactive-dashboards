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
  addDenominatorExpression,
  changeDenominatorAttribute,
  changeDenominatorDimension,
  changeDenominatorExpressionValue,
} from "../../Events";
import { $dataSourceType, $indicator } from "../../Store";
import { generateUid } from "../../utils/uid";
import { displayDataSourceType } from "../data-sources";

const DenominatorDialog = () => {
  const [active, setActive] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const indicator = useStore($indicator);
  const dataSourceType = useStore($dataSourceType);

  return (
    <Stack>
      <Button onClick={onOpen}>Denominator</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent m="48px">
          <ModalHeader>Denominator</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="100%">
            <Stack>
              <Stack>
                <Text>Denominator Name</Text>
                <Input
                  value={indicator.denominator.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    changeDenominatorAttribute({
                      attribute: "name",
                      value: e.target.value,
                    })
                  }
                />
              </Stack>
              <Stack>
                <Text>Denominator Description</Text>
                <Textarea
                  value={indicator.denominator.description}
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
                  <Select
                    value={indicator.numerator.type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      changeDenominatorAttribute({
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
                onChange: changeDenominatorDimension,
                denNum: indicator.denominator,
                changeQuery: changeDenominatorAttribute,
              })}

              {indicator.denominator.type === "SQL_VIEW" && (
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
                    {indicator.denominator.expressions?.map((record) =>
                      active === record.id ? (
                        <Tr key={record.id}>
                          <Td>
                            <Input
                              value={record.key}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                changeDenominatorExpressionValue({
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
                                changeDenominatorExpressionValue({
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
                              addDenominatorExpression({
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
              <Button onClick={onClose} colorScheme="red">
                Close
              </Button>
              <Button colorScheme="blue" onClick={onClose}>
                Save Denominator
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default DenominatorDialog;

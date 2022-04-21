import { useState, ChangeEvent } from "react";
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
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Event } from "effector";
import { IData, IDataSource, IExpression } from "../../interfaces";
import { generateUid } from "../../utils/uid";
import { displayDataSourceType } from "../data-sources";
import NamespaceSelect from "../NamespaceSelect";

type NumDenDialogProps = {
  label: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  changeDataSource: Event<IDataSource>;
  addExpression: Event<IExpression>;
  data: IData;
};

const NumDenDialog = ({
  label,
  isOpen,
  onOpen,
  onClose,
  data,
  changeDataSource,
  addExpression,
}: NumDenDialogProps) => {
  const [active, setActive] = useState<string>("");
  return (
    <Stack>
      <Button onClick={onOpen}>{label}</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent m="48px">
          <ModalHeader>{label}</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="100%">
            <Stack>
              <Stack>
                <Text>Data Source</Text>
                {/* <NamespaceSelect
                  value={data}
                  namespace="i-data-sources"
                  changeDataSource={changeDataSource}
                /> */}
              </Stack>
              {/* {displayDataSourceType(data.dataSource?.type)} */}

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
                  {data.expressions?.map((record) =>
                    active === record.id ? (
                      <Tr key={record.key}>
                        <Td>
                          <Input
                            value={record.key}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              (record.key = e.target.value)
                            }
                          />
                        </Td>
                        <Td>
                          <Input
                            value={record.value}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              (record.value = e.target.value)
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
                            addExpression({
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
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row">
              <Button onClick={onClose} colorScheme="red">
                Close
              </Button>
              <Button colorScheme="blue" onClick={onClose} >Save Visualization</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default NumDenDialog;

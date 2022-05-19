import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import {
  OrganisationUnitTree,
  Checkbox,
  MultiSelect,
  MultiSelectOption,
} from "@dhis2/ui";
import { useStore } from "effector-react";
import { useD2 } from "@dhis2/app-runtime-adapter-d2";
import { useState } from "react";
import { $store } from "../Store";

const DHIS2OrgUnitTree = () => {
  const store = useStore($store);
  const d2 = useD2();
  const [filters, setFilters] = useState<any[]>([]);
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const onSelectItems = ({ items }: any) => {
    setFilters(items);
  };

  const onDeselectItems = ({ itemIdsToRemove }: any) => {
    // const newList = filters.filter(
    //   (item: any) => !itemIdsToRemove.includes(item.id)
    // );
    // setFilters(newList);
  };

  const onReorderItems = ({ itemIds }: any) => {
    // const oldList = filters;
    // const reorderedList = itemIds.map((id: any) =>
    //   oldList.find((item: any) => item.id === id)
    // );
    // setFilters(reorderedList);
  };

  const onChange = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <Box style={{ paddingRight: 10 }}>
        {/* <Button onClick={onOpen}>Select OrgUnit</Button> */}
        {/* <pre>{JSON.stringify(d2, null, 2)}</pre> */}
      </Box>
      {/* <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Organisation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrgUnitDimension
              onSelect={onSelectItems}
              onDeselect={onDeselectItems}
              displayNameProperty="name"
              onReorder={onReorderItems}
              ouItems={filters}
              d2={d2}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => onOk()}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
};

export default DHIS2OrgUnitTree;

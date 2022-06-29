import { Box, Button, Spinner, Stack, useDisclosure } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import useOnClickOutside from "use-onclickoutside";
import { onChangeOrganisations } from "../Events";
import { useOrganisationUnits } from "../Queries";
import { $store } from "../Store";
import OUTree from "./OUTree";

const OUTreeSelect = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = React.useRef(null);
  useOnClickOutside(ref, onClose);
  const { isLoading, isSuccess, isError, error, data } = useOrganisationUnits();
  const store = useStore($store);
  const onChange = (data: {
    selectedUnits: React.Key[];
    selectedLevels: string[];
    selectedGroups: string[];
    expandedKeys: React.Key[];
  }) => {
    onChangeOrganisations({
      levels: data.selectedLevels,
      groups: data.selectedGroups,
      expandedKeys: data.expandedKeys,
      organisations: data.selectedUnits,
    });
    onClose();
  };
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack position="relative">
          <Button size="sm" onClick={onToggle}>
            Select OrgUnit
          </Button>
          {isOpen && (
            <Box bottom={0} top="100%" right={-15} zIndex={1000} position="absolute" m="auto">
              <OUTree
                {...data}
                selectedUnits={store.organisations}
                selectedLevels={store.levels}
                selectedGroups={store.groups}
                expandedKeys={store.expandedKeys}
                onChange={onChange}
              />
            </Box>
          )}
        </Stack>
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default OUTreeSelect;

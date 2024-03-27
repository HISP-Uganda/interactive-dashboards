import { Button, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { storeApi } from "../../Events";
import { $store } from "../../Store";
import OUTree from "../OUTree";
export default function OrgUnitPicker() {
  const { isOpen, onToggle } = useDisclosure();
  const store = useStore($store);

  return (
    <Stack position="relative" flex={1}>
      <Button
        onClick={onToggle}
        w="200px"
        size="md"
        variant="outline"
        colorScheme="blue"
        _hover={{ backgroundColor: "none" }}
      >
        <Text>Organisation Unit</Text>
      </Button>

      {isOpen && (
        <Stack
          position="absolute"
          top="40px"
          backgroundColor="white"
          boxShadow="xl"
          minW="300px"
          // minH="660px"
          // maxH="660px"
          right={0}
        >
          <OUTree
            value={store.organisations}
            onChange={(items) => {
              console.log(items);
              storeApi.setOrganisations(items);
            }}
          />
          {/* <Box p="10px">
                        <Button
                            onClick={() => {
                                onToggle();
                            }}
                        >
                            Update
                        </Button>
                    </Box> */}
        </Stack>
      )}
    </Stack>
  );
}

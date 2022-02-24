import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
  Input,
  Text,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import React from "react";

const MenuDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <Box>
      <Button onClick={onOpen}>
        <HamburgerIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Visual Menu</DrawerHeader>

          <DrawerBody>
            <Box>
                <Text>Something</Text>
            </Box>
          </DrawerBody>
ß
          <DrawerFooter>
            <Flex>
              <Button
                variant="outline"
                mr={3}
                onClick={onClose}
                colorScheme="red"
              >
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MenuDrawer;

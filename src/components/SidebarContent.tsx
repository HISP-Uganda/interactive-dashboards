import {
  Divider,
  Flex,
  Image,
  Spacer,
  Stack,
  StackProps,
  useColorModeValue,
  Text,
  Button,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { IconType } from "react-icons";
import moh from "../images/moh.json";
import who from "../images/who.json";
import hisp from "../images/hisp.json";
import { $categoryOptions, $store } from "../Store";
import Menus from "./Menus";
import NavItem from "./NavItem";
interface SidebarProps extends StackProps {}

const SidebarContent = ({ ...rest }: SidebarProps) => {
  const categoryOptions = useStore($categoryOptions);
  const store = useStore($store);
  return (
    <Stack w={{ base: "full", md: "250px" }} {...rest} spacing="15px" p="5px">
      <Button
        fontSize="xl"
        fontWeight="bold"
        textTransform="uppercase"
        color="blue.600"
      >
        Thematic Areas
      </Button>
      <Divider />

      {store.isAdmin ? (
        store.currentPage === "dashboards" ? (
          categoryOptions.map((link) => (
            <NavItem key={link.value} option={link} />
          ))
        ) : store.currentPage === "sections" ? null : (
          <Menus />
        )
      ) : (
        categoryOptions.map((link) => (
          <NavItem key={link.value} option={link} />
        ))
      )}
    </Stack>
  );
};

export default SidebarContent;

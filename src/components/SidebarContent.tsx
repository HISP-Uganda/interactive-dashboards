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
    <Stack
      bg={useColorModeValue("white", "gray.900")}
      w={{ base: "full", md: "250px" }}
      backgroundColor="gray.300"
      pos="fixed"
      h="calc(100vh - 58px)"
      {...rest}
      spacing="15px"
      p="5px"
    >
      <Flex alignItems="center" justifyContent="center">
        <Image src={moh} alt="Dan Abramov" boxSize="100px" />
      </Flex>
      <Divider />
      <Button fontSize="xl" fontWeight="bold" textTransform="uppercase" color="blue.600">
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
      <Spacer />
      <Divider />
      <Flex alignItems="center" justifyContent="center" >
        <Image src={who} alt="WHO" boxSize="78px" p={0} m={0} />
        <Spacer />
        <Image src={hisp} alt="HISP" boxSize="78px" p={0} m={0} />
      </Flex>
    </Stack>
  );
};

export default SidebarContent;

import { Icon, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { BsFolderPlus } from "react-icons/bs";
import { MdAddchart, MdInput, MdOutlineDashboard } from "react-icons/md";

const Menus = () => {
  const navigate = useNavigate();
  return (
    <Stack
      spacing="25px"
      boxShadow="2xl"
      h="calc(100vh - 96px - 72px)"
      p="20px"
    >
      <Stack
        alignItems="center"
        alignContent="center"
        cursor="pointer"
        direction="row"
        onClick={() => navigate({ to: "/settings/data-sources" })}
      >
        <Icon as={MdInput} w={8} h={8} color="blue.600" />
        <Text>Data Sources</Text>
      </Stack>
      <Stack
        alignItems="center"
        alignContent="center"
        direction="row"
        cursor="pointer"
        onClick={() => navigate({ to: "/settings/categories" })}
      >
        <Icon as={BsFolderPlus} w={8} h={8} color="blue.600" />
        <Text>Categories</Text>
      </Stack>
      <Stack
        alignItems="center"
        alignContent="center"
        direction="row"
        cursor="pointer"
        onClick={() => navigate({ to: "/settings/indicators" })}
      >
        <Icon as={MdAddchart} w={8} h={8} color="blue.600" />
        <Text>Visualization Data</Text>
      </Stack>
      <Stack
        alignItems="center"
        alignContent="center"
        direction="row"
        cursor="pointer"
        onClick={() => navigate({ to: "/settings/dashboards" })}
      >
        <Icon as={MdOutlineDashboard} w={8} h={8} color="blue.600" />
        <Text>Dashboards</Text>
      </Stack>
    </Stack>
  );
};

export default Menus;

import { AddIcon } from "@chakra-ui/icons";
import { MdOutlineDashboard, MdInput, MdAddchart } from "react-icons/md";
import { BsFolderPlus } from "react-icons/bs";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Stack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";

const Menus = () => {
  const navigate = useNavigate();
  return (
    <Stack spacing="30px">
      <Stack
        alignItems="center"
        alignContent="center"
        cursor="pointer"
        onClick={() => navigate({ to: "/data-sources" })}
      >
        <Icon as={MdInput} w={8} h={8} color="blue.600" />
        <Text>Data Sources</Text>
      </Stack>
      <Stack
        alignItems="center"
        alignContent="center"
        cursor="pointer"
        onClick={() => navigate({ to: "/categories" })}
      >
        <Icon as={BsFolderPlus} w={8} h={8} color="blue.600" />
        <Text>Categories</Text>
      </Stack>
      <Stack
        alignItems="center"
        alignContent="center"
        cursor="pointer"
        onClick={() => navigate({ to: "/indicators" })}
      >
        <Icon as={MdAddchart} w={8} h={8} color="blue.600" />
        <Text>Visualization Data</Text>
      </Stack>
      <Stack
        alignItems="center"
        alignContent="center"
        cursor="pointer"
        onClick={() => navigate({ to: "/dashboards" })}
      >
        <Icon as={MdOutlineDashboard} w={8} h={8} color="blue.600" />
        <Text>Dashboards</Text>
      </Stack>
      {/* <Menu matchWidth placement="right-start" autoSelect={false}>
        <MenuButton aria-label="Options" display="flex"></MenuButton>
        <MenuList>
          cursor="pointer"<MenuItem 
          onClick={() => navigate({ to: "/data-sources" })}>
            List
          </MenuItem>
          <MenuItem onClick={() => navigate({ to: "/data-sources/form" })}>
            Create
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu matchWidth placement="right-start" autoSelect={false}>
        <MenuButton aria-label="Options" display="flex"></MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate({ to: "/categories" })}>
            List
          </MenuItem>
          <MenuItem onClick={() => navigate({ to: "/categories/form" })}>
            Create
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu matchWidth placement="right-start" autoSelect={false}>
        <MenuButton aria-label="Options"></MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate({ to: "/indicators" })}>
            List
          </MenuItem>
          <MenuItem onClick={() => navigate({ to: "/indicators/form" })}>
            Create
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu matchWidth placement="right-start" autoSelect={false}>
        <MenuButton aria-label="Options" display="flex"></MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate({ to: "/dashboards" })}>
            List
          </MenuItem>
          <MenuItem onClick={() => navigate({ to: "/dashboards/form" })}>
            Create
          </MenuItem>
        </MenuList>
      </Menu> */}
    </Stack>
  );
};

export default Menus;

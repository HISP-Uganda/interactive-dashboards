import { useStore } from "effector-react";
import { $dashboard, $store } from "../../Store";

import { EditIcon, ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineNumber,
} from "react-icons/ai";
import { FaGlobeAfrica } from "react-icons/fa";

import { useNavigate, useSearch } from "@tanstack/react-location";
import { changeVisualizationType, setCurrentSection } from "../../Events";
import {
  FormGenerics,
  IDashboard,
  ISection,
  IVisualization,
} from "../../interfaces";
import Visualization from "./Visualization";

type VisualizationMenuProps = {
  section: ISection;
};

const VisualizationMenu = ({ section }: VisualizationMenuProps) => {
  const store = useStore($store);
  const navigate = useNavigate();
  const search = useSearch<FormGenerics>();
  const { isOpen: isFull, onOpen: onFull, onClose: onUnFull } = useDisclosure();
  const dashboard = useStore($dashboard);
  const displayFull = () => {
    onFull();
  };

  return (
    <>
      <Menu placement="left-start">
        <MenuButton
          _hover={{ bg: "none" }}
          _expanded={{ bg: "none" }}
          _focus={{ boxShadow: "none" }}
          bg="none"
          as={IconButton}
          icon={<HamburgerIcon />}
        />
        <MenuList>
          {store.isAdmin && (
            <MenuItem
              fontSize="18px"
              onClick={() => {
                setCurrentSection(section);
                navigate({
                  to: `/dashboards/${dashboard?.id}/section`,
                  search,
                });
              }}
              icon={<EditIcon />}
            >
              Edit
            </MenuItem>
          )}
          <MenuItem
            fontSize="18px"
            onClick={() => displayFull()}
            icon={<ExternalLinkIcon />}
          >
            Expand
          </MenuItem>

          <MenuItem
            fontSize="18px"
            onClick={() =>
              changeVisualizationType({
                section,
                visualization: "line",
              })
            }
            icon={<AiOutlineLineChart />}
          >
            View as Line
          </MenuItem>
          <MenuItem
            fontSize="18px"
            onClick={() =>
              changeVisualizationType({
                section,
                visualization: "bar",
              })
            }
            icon={<AiOutlineBarChart />}
          >
            View as Column
          </MenuItem>
          <MenuItem
            fontSize="18px"
            onClick={() =>
              changeVisualizationType({
                section,
                visualization: "map",
              })
            }
            icon={<FaGlobeAfrica />}
          >
            View as Map
          </MenuItem>
          <MenuItem
            fontSize="18px"
            onClick={() =>
              changeVisualizationType({
                section,
                visualization: "single",
              })
            }
            icon={<AiOutlineNumber />}
          >
            View as Single Value
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isFull} onClose={onUnFull} size="full">
        <ModalOverlay />
        <ModalContent h="100vh" display="flex" flexDirection="column" w="100vw">
          <ModalBody>
            <Stack h="100%" w="100%" direction={section?.direction}>
              {section?.visualizations.map((visualization) => (
                <Visualization
                  key={visualization.id}
                  visualization={visualization}
                  section={section}
                />
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VisualizationMenu;

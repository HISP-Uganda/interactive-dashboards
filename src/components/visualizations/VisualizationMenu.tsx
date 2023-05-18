import { useStore } from "effector-react";
import { $dashboard, $store, isOpenApi } from "../../Store";

import {
    DeleteIcon,
    EditIcon,
    ExternalLinkIcon,
    HamburgerIcon,
} from "@chakra-ui/icons";
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
import {
    // changeVisualizationType,
    // deleteSection,
    // setCurrentSection,
    sectionApi,
    dashboardApi,
} from "../../Events";
import { LocationGenerics, ISection } from "../../interfaces";
import Visualization from "./Visualization";

type VisualizationMenuProps = {
    section: ISection;
};

const VisualizationMenu = ({ section }: VisualizationMenuProps) => {
    const store = useStore($store);
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    const {
        isOpen: isFull,
        onOpen: onFull,
        onClose: onUnFull,
    } = useDisclosure();
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
                    bgColor="none"
                    as={IconButton}
                    icon={<HamburgerIcon h="2.7vh" />}
                    h="2.7vh"
                    variant="ghost"
                />
                <MenuList zIndex={100000}>
                    {store.isAdmin && (
                        <MenuItem
                            fontSize="18px"
                            onClick={() => {
                                sectionApi.setCurrentSection(section);
                                isOpenApi.onOpen();
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
                            dashboardApi.changeVisualizationType({
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
                            dashboardApi.changeVisualizationType({
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
                            dashboardApi.changeVisualizationType({
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
                            dashboardApi.changeVisualizationType({
                                section,
                                visualization: "single",
                            })
                        }
                        icon={<AiOutlineNumber />}
                    >
                        View as Single Value
                    </MenuItem>
                    {store.isAdmin && (
                        <MenuItem
                            fontSize="18px"
                            onClick={() =>
                                dashboardApi.deleteSection(section.id)
                            }
                            icon={<DeleteIcon color="red" />}
                        >
                            Delete
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
            <Modal isOpen={isFull} onClose={onUnFull} size="full">
                <ModalOverlay />
                <ModalContent
                    h="100vh"
                    display="flex"
                    flexDirection="column"
                    w="100vw"
                >
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

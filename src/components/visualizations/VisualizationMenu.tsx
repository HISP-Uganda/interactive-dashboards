import {
    DeleteIcon,
    EditIcon,
    ExternalLinkIcon,
    HamburgerIcon,
} from "@chakra-ui/icons";
import {
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import {
    AiFillFilter,
    AiOutlineBarChart,
    AiOutlineLineChart,
    AiOutlineNumber,
} from "react-icons/ai";
import { FaGlobeAfrica } from "react-icons/fa";
import { dashboardApi, sectionApi } from "../../Events";
import { ISection, LocationGenerics, Option } from "../../interfaces";
import { $dashboard, $store, isOpenApi } from "../../Store";
import Visualization from "./Visualization";

const sortingOptions: Option[] = [
    { label: "Top", value: "desc" },
    { label: "Bottom", value: "asc" },
];
type VisualizationMenuProps = {
    section: ISection;
};

const VisualizationMenu = ({ section }: VisualizationMenuProps) => {
    const store = useStore($store);
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onClose: onClose1,
    } = useDisclosure();
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
                    {section.visualizations.map(
                        (visualization) =>
                            visualization.needFilter && (
                                <MenuItem
                                    fontSize="18px"
                                    icon={<AiFillFilter />}
                                    onClick={onOpen1}
                                >
                                    Filter
                                </MenuItem>
                            )
                    )}
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
            <Modal
                // initialFocusRef={initialRef}
                // finalFocusRef={finalRef}
                isOpen={isOpen1}
                onClose={onClose1}
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Filter Your Own Choice</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Show</FormLabel>
                            <Stack spacing={3}>
                                <Select<Option, false, GroupBase<Option>>
                                    options={sortingOptions}
                                    value={sortingOptions.find(
                                        ({ value }) =>
                                            value ===
                                            section.visualizations[0].order
                                    )}
                                    onChange={(e) =>
                                        dashboardApi.changeVisualizationOrder({
                                            section,
                                            order: e?.value || "",
                                        })
                                    }
                                />
                            </Stack>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Enter Value</FormLabel>
                            <Input
                                placeholder="Enter your Choice"
                                value={section.visualizations[0].show}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    dashboardApi.changeVisualizationShow({
                                        section,
                                        show: Number(e.target.value),
                                    })
                                }
                            />
                        </FormControl>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default VisualizationMenu;

import {
    DeleteIcon,
    EditIcon,
    ExternalLinkIcon,
    HamburgerIcon,
    DownloadIcon,
} from "@chakra-ui/icons";
import {
    FormControl,
    FormLabel,
    List,
    ListItem,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    useDisclosure,
    Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
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
type ListMenuProps = {
    section: ISection;
};

const ListMenu = ({ section }: ListMenuProps) => {
    const store = useStore($store);
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    const MotionListItem = motion(ListItem);
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
            <List spacing={3} color="gray.600">
                <MotionListItem
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => {
                        sectionApi.setCurrentSection(section);
                        isOpenApi.onOpen();
                    }}
                >
                    <Icon as={DownloadIcon} /> Download
                    </MotionListItem>
                {store.isAdmin && (
                    <MotionListItem
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => {
                            sectionApi.setCurrentSection(section);
                            isOpenApi.onOpen();
                        }}
                    >
                        <Icon as={EditIcon} /> Edit
                    </MotionListItem>
                )}
                <MotionListItem
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => displayFull()}
                >
                    <Icon as={ExternalLinkIcon} /> Expand
                 </MotionListItem>
                <MotionListItem
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    onClick={() =>
                        dashboardApi.changeVisualizationType({
                            section,
                            visualization: "line",
                        })
                    }
                >
                    <Icon as={AiOutlineLineChart} /> View as Line
                </MotionListItem>
                <MotionListItem
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    onClick={() =>
                        dashboardApi.changeVisualizationType({
                            section,
                            visualization: "bar",
                        })
                    }
                >
                    <Icon as={AiOutlineBarChart} /> View as Column
            </MotionListItem>
                <MotionListItem
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    onClick={() =>
                        dashboardApi.changeVisualizationType({
                            section,
                            visualization: "map",
                        })
                    }
                >
                    <Icon as={FaGlobeAfrica} /> View as Map
                </MotionListItem>
                <MotionListItem
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    onClick={() =>
                        dashboardApi.changeVisualizationType({
                            section,
                            visualization: "single",
                        })
                    }
                >
                    <Icon as={AiOutlineNumber} /> View as Single Value
                </MotionListItem>
                {section.visualizations.map(
                    (visualization) =>
                        visualization.needFilter && (
                            <MotionListItem
                                key={visualization.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                onClick={onOpen1}
                            >
                                <Icon as={AiFillFilter} /> Filter
                            </MotionListItem>
                        )
                )}
                {store.isAdmin && (
                    <MotionListItem
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => dashboardApi.deleteSection(section.id)}
                    >
                        <Icon as={DeleteIcon} color="red" /> Delete
                    </MotionListItem>
                )}
            </List>
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
                                            section.visualizations[0]?.order
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
                                value={section.visualizations[0]?.show}
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

export default ListMenu;

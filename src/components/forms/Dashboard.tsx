import {
    Box,
    Button,
    Checkbox,
    Grid,
    GridItem,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    Textarea,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from "react";
import { SwatchesPicker } from "react-color";
import { FaPlus } from "react-icons/fa";
import {
    addSection,
    changeCategory,
    changeDashboardDescription,
    changeDashboardName,
    setCurrentDashboard,
    setCurrentSection,
    setDashboards,
    setDefaultDashboard,
    setRefresh,
    setSections,
} from "../../Events";
import {
    IDashboard,
    ISection,
    Option,
    LocationGenerics,
} from "../../interfaces";
import { saveDocument } from "../../Queries";
import {
    $categoryOptions,
    $dashboard,
    $dashboards,
    $dimensions,
    $isOpen,
    $section,
    $store,
    createSection,
    isOpenApi,
    dashboardApi,
    $settings,
} from "../../Store";
import Section from "../Section";
import SectionVisualization from "../SectionVisualization";
import AutoRefreshPicker from "../AutoRefreshPicker";
import { useDataEngine } from "@dhis2/app-runtime";
import { useSearch, useNavigate } from "@tanstack/react-location";
import { swatchColors } from "../../utils/utils";

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dashboards = useStore($dashboards);
    const search = useSearch<LocationGenerics>();
    const navigate = useNavigate<LocationGenerics>();
    const { isOpen: isOpenDialog, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpenBg,
        onOpen: onOpenBg,
        onClose: onCloseBg,
    } = useDisclosure();
    const categoryOptions = useStore($categoryOptions);
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const section = useStore($section);
    const { isNotDesktop } = useStore($dimensions);
    const isOpen = useStore($isOpen);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const templateColumns = useBreakpointValue({
        base: "auto",
        sm: "auto",
        md: "auto",
        lg: `repeat(${dashboard.columns}, 1fr)`,
    });
    const templateRows = useBreakpointValue({
        base: "auto",
        sm: "auto",
        md: "auto",
        lg: `repeat(${dashboard.rows}, 1fr)`,
    });
    const dragItem = useRef<number | undefined | null>();
    const dragOverItem = useRef<number | null>();
    const dragStart = (e: DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
    };

    const dragEnter = (e: DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
    };

    const drop = (e: DragEvent<HTMLDivElement>) => {
        const copyListItems = [...dashboard.sections];
        if (
            dragItem.current !== null &&
            dragItem.current !== undefined &&
            dragOverItem.current !== null &&
            dragOverItem.current !== undefined
        ) {
            const dragItemContent = copyListItems[dragItem.current];
            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(dragOverItem.current, 0, dragItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            setSections(copyListItems);
        }
    };

    const onClick = () => {
        setCurrentSection(createSection());
        isOpenApi.onOpen();
    };

    const onApply = () => {
        addSection(section);
        isOpenApi.onClose();
    };

    const updateDashboard = async (data: any) => {
        setLoading(true);
        await saveDocument(
            storage,
            "i-dashboards",
            store.systemId,
            data,
            engine,
            search.action || "create"
        );
        const setting = {
            default: store.defaultDashboard,
            id: store.systemId,
        };
        await saveDocument(
            storage,
            "i-dashboard-settings",
            store.systemId,
            setting,
            engine,
            "update"
        );
        setLoading(() => false);
        setRefresh(true);
        onClose();
    };

    const togglePublish = async (data: IDashboard, value: boolean) => {
        await saveDocument(
            storage,
            "i-dashboards",
            store.systemId,
            {
                ...data,
                published: true,
            },
            engine,
            "update"
        );
        setDashboards(
            dashboards.map((d) => {
                if (data.id === d.id) {
                    return { ...d, published: value };
                }
                return d;
            })
        );
        setCurrentDashboard({ ...data, published: value });
    };
    return (
        <Stack w="100%" h="100%" p="5px">
            <Grid
                templateColumns={templateColumns}
                templateRows={templateRows}
                gap="5px"
                h="100%"
                w="100%"
                bg={dashboard.bg}
            >
                {dashboard?.sections.map((section: ISection, index: number) => (
                    <GridItem
                        draggable
                        onDragStart={(e) => dragStart(e, index)}
                        onDragEnter={(e) => dragEnter(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={drop}
                        bgColor={section.bg}
                        key={section.id}
                        colSpan={{ lg: section.colSpan, md: 1 }}
                        rowSpan={{ lg: section.rowSpan, md: 1 }}
                        h={
                            isNotDesktop
                                ? section.height
                                    ? section.height
                                    : "15vh"
                                : "100%"
                        }
                        maxH={
                            isNotDesktop
                                ? section.height
                                    ? section.height
                                    : "15vh"
                                : "100%"
                        }
                        onClick={(e: MouseEvent<HTMLElement>) => {
                            if (e.detail === 2 && store.isAdmin) {
                                setCurrentSection(section);
                                isOpenApi.onOpen();
                            }
                        }}
                    >
                        <SectionVisualization {...section} />
                    </GridItem>
                ))}
            </Grid>

            <Modal
                isOpen={isOpen}
                onClose={() => isOpenApi.onClose()}
                scrollBehavior="inside"
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    minH="calc(100vh - 200px)"
                    minW="calc(100vw - 200px)"
                    maxH="calc(100vh - 200px)"
                    maxW="calc(100vw - 200px)"
                >
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Section />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => isOpenApi.onClose()}
                        >
                            Discard
                        </Button>
                        <Button onClick={() => onApply()}>Apply</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box
                position="fixed"
                width="60px"
                height="60px"
                bottom="40px"
                right="40px"
                color="#FFF"
                textAlign="center"
            >
                <IconButton
                    onClick={() => onClick()}
                    borderRadius="50px"
                    width="60px"
                    height="60px"
                    colorScheme="blue"
                    marginTop="22px"
                    aria-label="Search database"
                    icon={<FaPlus />}
                />
            </Box>

            <Stack
                position="fixed"
                top="50px"
                right="45px"
                direction="row"
                spacing="5"
            >
                <Button colorScheme="blue" onClick={onOpenBg}>
                    Background
                </Button>
                <Button colorScheme="blue" onClick={onOpen}>
                    Save
                </Button>
                {dashboard.published && (
                    <Button
                        colorScheme="red"
                        onClick={() => togglePublish(dashboard, false)}
                    >
                        Unpublish
                    </Button>
                )}
                {!dashboard.published && (
                    <Button
                        colorScheme="teal"
                        onClick={() => togglePublish(dashboard, true)}
                    >
                        Publish
                    </Button>
                )}
                <Button
                    colorScheme="blue"
                    onClick={() => navigate({ to: "/settings/dashboards" })}
                >
                    Home
                </Button>
            </Stack>

            <Modal isOpen={isOpenBg} onClose={onCloseBg} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Dashboard Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SwatchesPicker
                            colors={swatchColors}
                            color={dashboard.bg}
                            onChangeComplete={(color) => {
                                dashboardApi.changeBg(color.hex);
                                onCloseBg();
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDialog} onClose={onClose} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Dashboard Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing="20px">
                            <Stack>
                                <Text>Category</Text>
                                <Select<Option, false, GroupBase<Option>>
                                    options={categoryOptions}
                                    value={categoryOptions.find(
                                        (d: Option) =>
                                            d.value === dashboard.category
                                    )}
                                    onChange={(e) =>
                                        changeCategory(e?.value || "")
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Text>Name</Text>
                                <Input
                                    value={dashboard.name}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => changeDashboardName(e.target.value)}
                                />
                            </Stack>
                            <Stack>
                                <Text>Tag</Text>
                                <Input
                                    value={dashboard.tag}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => dashboardApi.changeTag(e.target.value)}
                                />
                            </Stack>
                            <Stack>
                                <Text>Description</Text>
                                <Textarea
                                    value={dashboard.description}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                        changeDashboardDescription(
                                            e.target.value
                                        )
                                    }
                                />
                            </Stack>
                            <AutoRefreshPicker />
                            <Stack>
                                <Checkbox
                                    isChecked={
                                        store.defaultDashboard === dashboard.id
                                    }
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setDefaultDashboard(
                                            e.target.checked ? dashboard.id : ""
                                        )
                                    }
                                >
                                    Default Dashboard
                                </Checkbox>
                            </Stack>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={() => updateDashboard(dashboard)}
                            isLoading={loading}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
};

export default Dashboard;

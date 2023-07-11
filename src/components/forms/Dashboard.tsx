import {
    Box,
    Button,
    Checkbox,
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
    useDisclosure,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { SwatchesPicker } from "react-color";
import { useFullScreenHandle } from "react-full-screen";
import { FaPlus } from "react-icons/fa";
import {
    dashboardApi,
    sectionApi,
    storeApi,
    dashboardsApi,
} from "../../Events";
import { IDashboard, LocationGenerics, Option } from "../../interfaces";
import { saveDocument } from "../../Queries";
import {
    $categoryOptions,
    $dashboard,
    $dashboardType,
    $isOpen,
    $section,
    $settings,
    $store,
    createSection,
    isOpenApi,
} from "../../Store";
import { swatchColors } from "../../utils/utils";
import AutoRefreshPicker from "../AutoRefreshPicker";
import DashboardDropDown from "../DashboardDropDown";
import DashboardFilter from "../DashboardFilter";
import DynamicDashboard from "../DynamicDashboard";
import FixedDashboard from "../FixedDashboard";
import Section from "../Section";

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
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
    const isOpen = useStore($isOpen);
    const dashboardType = useStore($dashboardType);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const handle = useFullScreenHandle();

    useEffect(() => {
        const callback = async (event: KeyboardEvent) => {
            if (event.key === "F5" || event.key === "f5") {
                await handle.enter();
                if (handle.active) {
                    storeApi.setIsFullScreen(true);
                } else {
                    storeApi.setShowSider(true);
                    storeApi.setIsFullScreen(true);
                }
            }
        };
        document.addEventListener("keydown", callback);
        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, []);

    const onClick = () => {
        sectionApi.setCurrentSection(createSection());
        isOpenApi.onOpen();
    };

    const onApply = () => {
        dashboardApi.addSection(section);
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
            defaultDashboard: store.defaultDashboard,
            id: "settings",
        };
        try {
            await saveDocument(
                storage,
                "i-dashboard-settings",
                store.systemId,
                setting,
                engine,
                "update"
            );
        } catch (error) {
            await saveDocument(
                storage,
                "i-dashboard-settings",
                store.systemId,
                setting,
                engine,
                "create"
            );
        }
        setLoading(() => false);
        storeApi.setRefresh(true);
        onClose();
        navigate({
            search: (old) => ({ ...old, action: "update" }),
            replace: true,
        });
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
        // dashboardsApi.setDashboards(
        //     dashboards.map((d) => {
        //         if (data.id === d.id) {
        //             return { ...d, published: value };
        //         }
        //         return d;
        //     })
        // );
        dashboardApi.setCurrentDashboard({ ...data, published: value });
    };
    return (
        <Stack w="100%" h="100%" p="5px" bg={dashboard.bg}>
            {dashboardType === "dynamic" ? (
                <DynamicDashboard />
            ) : (
                <FixedDashboard />
            )}
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
                    <ModalHeader>Edit Visualisation and Section</ModalHeader>
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
                    <ModalHeader>Dashboard Background</ModalHeader>
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
            <Modal isOpen={isOpenDialog} onClose={onClose} size="4xl">
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
                                        dashboardApi.changeCategory(
                                            e?.value || ""
                                        )
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Text>Name</Text>
                                <Input
                                    value={dashboard.name}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dashboardApi.changeDashboardName(
                                            e.target.value
                                        )
                                    }
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
                                        dashboardApi.changeDashboardDescription(
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
                                        storeApi.setDefaultDashboard(
                                            e.target.checked ? dashboard.id : ""
                                        )
                                    }
                                >
                                    Default Dashboard
                                </Checkbox>
                            </Stack>
                            <Stack>
                                <Checkbox
                                    isChecked={dashboard.excludeFromList}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dashboardApi.changeExcludeFromList(
                                            e.target.checked
                                        )
                                    }
                                >
                                    Exclude from List
                                </Checkbox>
                            </Stack>
                            <Stack>
                                <Text>Child Dashboard</Text>
                                <DashboardDropDown
                                    value={dashboard.child || ""}
                                    onChange={(e) =>
                                        dashboardApi.changeChild(e)
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Text>Filters</Text>
                                <DashboardFilter />
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

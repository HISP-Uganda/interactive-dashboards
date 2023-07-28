import {
    Button,
    Checkbox,
    Input,
    Spacer,
    Stack,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Modal } from "antd";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { dashboardApi, sectionApi, storeApi } from "../../Events";
import { ICategory, IDashboard, LocationGenerics } from "../../interfaces";
import { saveDocument, useNamespace } from "../../Queries";
import {
    $dashboard,
    $dashboardType,
    $isOpen,
    $section,
    $settings,
    $store,
    createSection,
    isOpenApi,
} from "../../Store";
import AutoRefreshPicker from "../AutoRefreshPicker";
import DashboardDropDown from "../DashboardDropDown";
import DashboardFilter from "../DashboardFilter";
import DynamicDashboard from "../DynamicDashboard";
import FixedDashboard from "../FixedDashboard";
import LoadingIndicator from "../LoadingIndicator";
import Picker from "../Picker";
import Section from "../Section";

const Categories = () => {
    const { storage } = useStore($settings);
    const { systemId } = useStore($store);
    const { isLoading, isSuccess, isError, error, data } =
        useNamespace<ICategory>("i-categories", storage, systemId, []);
    const dashboard = useStore($dashboard);

    if (isError) return <Text>{error?.message}</Text>;
    if (isLoading) return <LoadingIndicator />;
    if (isSuccess && data)
        return (
            <Select<ICategory, false, GroupBase<ICategory>>
                options={data}
                value={data.find((d) => d.id === dashboard.category)}
                onChange={(e) => dashboardApi.changeCategory(e?.id || "")}
                getOptionValue={(v) => v.id}
                getOptionLabel={(v) => v.name || ""}
            />
        );
    return null;
};

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const search = useSearch<LocationGenerics>();
    const navigate = useNavigate<LocationGenerics>();
    const { isOpen: isOpenDialog, onOpen, onClose } = useDisclosure();
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
        dashboardApi.setCurrentDashboard({ ...data, published: value });
    };
    return (
        <Stack w="100%" h="100%" bg={dashboard.bg} spacing="0">
            {store.isAdmin && (
                <Stack h="48px" direction="row" alignItems="center" px="5px">
                    <Spacer />
                    <Button onClick={() => onClick()} size="sm">
                        Add Section
                    </Button>
                    <Picker
                        color={dashboard.bg}
                        onChange={(color) => dashboardApi.changeBg(color)}
                    />
                    <Button colorScheme="blue" onClick={onOpen} size="sm">
                        Save
                    </Button>
                    {dashboard.published && (
                        <Button
                            colorScheme="red"
                            onClick={() => togglePublish(dashboard, false)}
                            size="sm"
                        >
                            Unpublish
                        </Button>
                    )}
                    {!dashboard.published && (
                        <Button
                            colorScheme="teal"
                            onClick={() => togglePublish(dashboard, true)}
                            size="sm"
                        >
                            Publish
                        </Button>
                    )}
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate({ to: "/settings/dashboards" })}
                        size="sm"
                    >
                        Home
                    </Button>
                </Stack>
            )}
            <Stack
                h={store.isAdmin ? "calc(100vh - 96px)" : "calc(100vh - 48px)"}
                p="5px"
            >
                {dashboardType === "dynamic" ? (
                    <DynamicDashboard />
                ) : (
                    <FixedDashboard />
                )}
            </Stack>
            <Modal
                centered
                width={"calc(100vw - 100px)"}
                open={isOpen}
                title="Title"
                onOk={() => isOpenApi.onClose()}
                onCancel={() => isOpenApi.onClose()}
                footer={[
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => isOpenApi.onClose()}
                    >
                        Discard
                    </Button>,
                    <Button onClick={() => onApply()}>Apply</Button>,
                ]}
                bodyStyle={{
                    height: "calc(100vh - 150px)",
                }}
            >
                <Section />
            </Modal>
            {/* <Modal isOpen={isOpenBg} onClose={onCloseBg} size="2xl">
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
            </Modal> */}
            <Modal
                open={isOpenDialog}
                onOk={() => onClose()}
                onCancel={() => onClose()}
                title="Save Dashboard"
                width="700px"
                footer={[
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        Close
                    </Button>,
                    <Button
                        onClick={() => updateDashboard(dashboard)}
                        isLoading={loading}
                    >
                        Save
                    </Button>,
                ]}
            >
                <Stack spacing="20px">
                    <Stack>
                        <Text>Category</Text>
                        <Categories />
                    </Stack>
                    <Stack>
                        <Text>Name</Text>
                        <Input
                            value={dashboard.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                dashboardApi.changeDashboardName(e.target.value)
                            }
                        />
                    </Stack>
                    <Stack>
                        <Text>Tag</Text>
                        <Input
                            value={dashboard.tag}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                dashboardApi.changeTag(e.target.value)
                            }
                        />
                    </Stack>
                    <Stack>
                        <Text>Description</Text>
                        <Textarea
                            value={dashboard.description}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                dashboardApi.changeDashboardDescription(
                                    e.target.value
                                )
                            }
                        />
                    </Stack>
                    <AutoRefreshPicker />
                    <Stack>
                        <Checkbox
                            isChecked={store.defaultDashboard === dashboard.id}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                            onChange={(e) => dashboardApi.changeChild(e)}
                        />
                    </Stack>
                    <Stack>
                        <Text>Filters</Text>
                        <DashboardFilter />
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    );
};

export default Dashboard;

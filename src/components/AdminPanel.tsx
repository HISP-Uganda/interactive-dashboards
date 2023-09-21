import React, { useState, ChangeEvent } from "react";
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
import { Modal } from "antd";
import { NumberField, CheckboxField } from "./fields";
import { dashboardApi, sectionApi, settingsApi, storeApi } from "../Events";
import {
    createSection,
    isOpenApi,
    $store,
    $settings,
    $dashboard,
    $isOpen,
    $section,
} from "../Store";
import { IDashboard, LocationGenerics } from "../interfaces";
import { saveDocument } from "../Queries";
import Picker from "./Picker";
import { useStore } from "effector-react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useSearch, useNavigate } from "@tanstack/react-location";
import Section from "./Section";
import { Categories } from "./lists";
import AutoRefreshPicker from "./AutoRefreshPicker";
import DashboardDropDown from "./DashboardDropDown";
import DashboardFilter from "./DashboardFilter";

export default function AdminPanel() {
    const [loading, setLoading] = useState<boolean>(false);
    const search = useSearch<LocationGenerics>();
    const navigate = useNavigate<LocationGenerics>();
    const { isOpen: isOpenDialog, onOpen, onClose } = useDisclosure();
    const section = useStore($section);
    const settings = useStore($settings);
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const isOpen = useStore($isOpen);

    const engine = useDataEngine();

    const onApply = () => {
        dashboardApi.addSection(section);
        isOpenApi.onClose();
    };

    const updateDashboard = async (data: any) => {
        setLoading(true);
        await saveDocument(
            settings.storage,
            "i-dashboards",
            store.systemId,
            data,
            engine,
            search.action || "create"
        );
        try {
            await saveDocument(
                settings.storage,
                "i-dashboard-settings",
                store.systemId,
                settings,
                engine,
                "update"
            );
        } catch (error) {
            await saveDocument(
                settings.storage,
                "i-dashboard-settings",
                store.systemId,
                settings,
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

    const onClick = () => {
        sectionApi.setCurrentSection(createSection());
        isOpenApi.onOpen();
    };
    const togglePublish = async (data: IDashboard, value: boolean) => {
        await saveDocument(
            settings.storage,
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
        <Stack
            h="48px"
            direction="row"
            alignItems="center"
            px={`${dashboard.spacing}px`}
        >
            <Spacer />
            <NumberField<IDashboard>
                title="Spacing"
                attribute="spacing"
                func={dashboardApi.changeAttribute}
                obj={dashboard}
                direction="row"
                alignItems="center"
            />
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

            <Modal
                centered
                width={"calc(100vw - 100px)"}
                mask={false}
                open={isOpen}
                title="Title"
                onOk={() => isOpenApi.onClose()}
                onCancel={() => isOpenApi.onClose()}
                footer={[
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => isOpenApi.onClose()}
                        key="btn1"
                    >
                        Discard
                    </Button>,
                    <Button onClick={() => onApply()} key="btn2">
                        Apply
                    </Button>,
                ]}
                bodyStyle={{
                    height: "calc(100vh - 150px)",
                }}
            >
                <Section />
            </Modal>
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
                            isChecked={
                                settings.defaultDashboard === dashboard.id
                            }
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                settingsApi.changeAttribute({
                                    value: e.target.checked ? dashboard.id : "",
                                    attribute: "defaultDashboard",
                                })
                            }
                        >
                            Default Dashboard
                        </Checkbox>
                    </Stack>

                    <Stack>
                        <Checkbox
                            isChecked={settings.template === dashboard.id}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                settingsApi.changeAttribute({
                                    value: e.target.checked ? dashboard.id : "",
                                    attribute: "template",
                                })
                            }
                        >
                            Make template
                        </Checkbox>
                    </Stack>

                    <CheckboxField<IDashboard>
                        title="Exclude from List"
                        func={dashboardApi.changeAttribute}
                        obj={dashboard}
                        attribute="excludeFromList"
                    />
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
}

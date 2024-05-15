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
import { useStore } from "effector-react";
import React, { ChangeEvent, useState } from "react";
import { dashboardApi, sectionApi, settingsApi, storeApi } from "../Events";
import { ICategory, IDashboard, LocationGenerics, Option } from "../interfaces";
import { saveDocument } from "../Queries";
import {
    $dashboard,
    $isOpen,
    $section,
    $settings,
    $store,
    createSection,
    isOpenApi,
} from "../Store";
import AutoRefreshPicker from "./AutoRefreshPicker";
import DashboardFilter from "./DashboardFilter";
import { CheckboxField, NumberField, SelectField } from "./fields";
import ResourceField from "./fields/ResourceField";
import Picker from "./Picker";
import Section from "./Section";
import CategoryComboFilter from "./visualizations/CategoryComboFilter";

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
            maxH="48px"
            minH="48px"
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
            <NumberField<IDashboard>
                title="Padding"
                attribute="padding"
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
                width={"calc(100vw - 100px)"}
                mask={false}
                open={isOpen}
                title="Title"
                centered
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
            >
                <Section />
            </Modal>
            <Modal
                open={isOpenDialog}
                onOk={() => onClose()}
                onCancel={() => onClose()}
                title="Save Dashboard"
                width="calc(100vw - 500px)"
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
                    <ResourceField<IDashboard, ICategory>
                        title="Category"
                        resource="i-categories"
                        attribute="category"
                        func={dashboardApi.changeAttribute}
                        obj={dashboard}
                        multiple={false}
                    />
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
                    <Stack>
                        <Text>Order</Text>
                        <Input
                            value={dashboard.order}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                dashboardApi.changeOrder(e.target.value)
                            }
                        />
                    </Stack>
                    <Stack direction="row" spacing="20px" alignItems="center">
                        <AutoRefreshPicker />
                        <Stack>
                            <Checkbox
                                isChecked={
                                    settings.defaultDashboard === dashboard.id
                                }
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    settingsApi.changeAttribute({
                                        value: e.target.checked
                                            ? dashboard.id
                                            : "",
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
                                        value: e.target.checked
                                            ? dashboard.id
                                            : "",
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
                    </Stack>
                    <CategoryComboFilter
                        api={null}
                        isCurrentDHIS2={true}
                        value={dashboard.categoryCombo}
                        onChange={(val) =>
                            dashboardApi.changeAttribute({
                                attribute: "categoryCombo",
                                value: val,
                            })
                        }
                    />
                    <Stack>
                        <Text>Filters</Text>
                        <DashboardFilter />
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    );
}

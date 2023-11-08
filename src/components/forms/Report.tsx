import {
    Button,
    Input,
    Stack,
    Text,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { Modal } from "antd";
import { useStore } from "effector-react";
import React, { ChangeEvent, useState } from "react";
import { reportApi, userGroupApi } from "../../Events";
import {
    IReport,
    IUserGroup,
    LocationGenerics,
    Option,
} from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $report, $settings, $store, $userGroup } from "../../Store";
import { NumberField, SelectField } from "../fields";
import UserGroups from "../lists/UserGroups";
import DHIS2MetadataPicker from "../properties/DHIS2MetadataPicker";
import { generateUid } from "../../utils/uid";

const ReportForm = () => {
    const userGroup = useStore($userGroup);
    return (
        <Stack justifyContent="space-between" h="100%">
            <Stack>
                <Text>User Group Name</Text>
                <Input
                    value={userGroup.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        userGroupApi.update({
                            value: e.target.value,
                            attribute: "name",
                        });
                    }}
                />
            </Stack>
            <Stack>
                <Text>Description</Text>
                <Textarea
                    value={userGroup.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        userGroupApi.update({
                            value: e.target.value,
                            attribute: "description",
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

const SavedUsers = () => {
    const report = useStore($report);

    const callback = (id: string, value: boolean) => {
        const allValues = report.emails?.split(",") || [];
        if (value) {
            reportApi.update({
                attribute: "emails",
                value: [...allValues, id].join(","),
            });
        } else {
            reportApi.update({
                attribute: "emails",
                value: allValues.filter((val) => val !== id).join(","),
            });
        }
    };
    return (
        <DHIS2MetadataPicker<IUserGroup>
            resource="users"
            fields="id,displayName,username,email"
            filter="email:!null"
            list={report.emails?.split(",") || []}
            callback={callback}
            valueField="email"
        />
    );
};

export default function Report() {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const userGroup = useStore($userGroup);
    const navigate = useNavigate<LocationGenerics>();
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const search = useSearch<LocationGenerics>();
    const store = useStore($store);
    const report = useStore($report);
    const [component, setComponent] = useState<React.ReactNode>(null);
    const [dimensions, setDimensions] = useState<{
        w: string;
        h: string;
        title: string;
        execute?: boolean;
    }>({
        h: "calc(100vh - 384px)",
        w: "calc(100vw - 500px)",
        title: "DHIS2 users",
    });
    const handleOk = async () => {
        if (dimensions.execute) {
            if (report.emails && userGroup.name) {
                setLoading(() => true);
                await saveDocument<IUserGroup>(
                    storage,
                    "i-user-groups",
                    store.systemId,
                    {
                        id: generateUid(),
                        email: report.emails.split(","),
                        ...userGroup,
                    },
                    engine,
                    "create"
                );
                setLoading(() => false);
                toast({
                    title: "User group",
                    description: "User group saved successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            }
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const showModal = (modal: string) => {
        if (modal === "metadata") {
            setDimensions(() => ({
                h: "calc(100vh - 384px)",
                w: "calc(100vw - 500px)",
                title: "DHIS2 users",
            }));
            setComponent(() => <SavedUsers />);
        } else if (modal === "groups") {
            setDimensions(() => ({
                h: "calc(100vh - 384px)",
                w: "calc(100vw - 500px)",
                title: "User groups",
            }));
            setComponent(() => <UserGroups />);
        } else if (modal === "saving") {
            setDimensions(() => ({
                h: "300px",
                w: "500px",
                title: "Saving user group",
                execute: true,
            }));
            setComponent(() => <ReportForm />);
        }
        setOpen(true);
    };

    const saveReport = async () => {
        setLoading(() => true);
        await saveDocument(
            storage,
            "i-reports",
            store.systemId,
            report,
            engine,
            search.action || "create"
        );
        toast({
            title: "Report",
            description: "Report saved successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        setLoading(() => false);
        navigate({
            to: `/settings/reports/${report.id}/design`,
            search: { action: "update" },
        });
    };

    return (
        <Stack w="100%" h="100%" spacing="20px">
            <Stack>
                <Text>Report Name</Text>
                <Input
                    value={report.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        reportApi.update({
                            attribute: "name",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <Stack>
                <Text>Description</Text>
                <Textarea
                    value={report.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        reportApi.update({
                            attribute: "description",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <SelectField<IReport, Option>
                options={[
                    { label: "A3", value: "A3" },
                    { label: "A4", value: "A4" },
                    { label: "A5", value: "A5" },
                    { label: "letter", value: "letter" },
                    { label: "legal", value: "legal" },
                ]}
                attribute="size"
                obj={report}
                title="Paper Size"
                func={reportApi.update}
                multiple={false}
                labelField="label"
                valueField="value"
            />
            <Text>Recipient Email addresses(separated by comma)</Text>
            <Stack direction="row" alignItems="center">
                <Textarea
                    rows={5}
                    value={report.emails}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        reportApi.update({
                            attribute: "emails",
                            value: e.target.value,
                        });
                    }}
                />
                <Stack>
                    <Button onClick={() => showModal("metadata")}>
                        Add users from DHIS2
                    </Button>
                    <Button onClick={() => showModal("groups")}>
                        Add users from groups
                    </Button>
                    <Button onClick={() => showModal("saving")}>
                        Save users as groups
                    </Button>
                </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing="20px">
                <SelectField<IReport, Option>
                    options={[
                        { label: "Every5s", value: "*/5 * * * * *" },
                        { label: "Minutely", value: "* * * * *" },
                        { label: "Every5m", value: "*/5 * * * *" },
                        { label: "Hourly", value: "0 * * * *" },
                        { label: "Daily", value: "0 0 * * *" },
                        { label: "Weekly", value: "0 0 * * additionalDays" },
                        { label: "Monthly", value: "0 0 additionalDays * *" },
                        {
                            label: "BiMonthly",
                            value: "0 0 additionalDays */2 *",
                        },
                        {
                            label: "Quarterly",
                            value: "0 0 additionalDays */3 *",
                        },
                        {
                            label: "SixMonthly",
                            value: "0 0 additionalDays */6 *",
                        },
                        { label: "Yearly", value: "0 0 additionalDays 1 *" },
                        {
                            label: "FinancialJuly",
                            value: "0 0 additionalDays 7 *",
                        },
                        {
                            label: "FinancialApril",
                            value: "0 0 additionalDays 4 *",
                        },
                        {
                            label: "FinancialOct",
                            value: "0 0 additionalDays 10 *",
                        },
                    ]}
                    attribute="schedule"
                    obj={report}
                    title="Schedule"
                    func={reportApi.update}
                    multiple={false}
                    labelField="label"
                    valueField="value"
                    flex={1}
                />
                <NumberField<IReport>
                    attribute="additionalDays"
                    func={reportApi.update}
                    title="Additional Days"
                    obj={report}
                    flex={1}
                    width="100%"
                />
            </Stack>
            <Stack direction="row" alignSelf="flex-end">
                <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                        navigate({ to: "/settings/reports", search: {} });
                    }}
                >
                    Cancel
                </Button>

                <Button onClick={() => saveReport()} isLoading={loading}>
                    Save Report
                </Button>
            </Stack>
            <Modal
                open={open}
                title={dimensions.title}
                width={dimensions.w}
                centered
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleOk} isLoading={loading}>
                        OK
                    </Button>,
                ]}
                style={{ height: dimensions.h }}
            >
                {component}
            </Modal>
        </Stack>
    );
}

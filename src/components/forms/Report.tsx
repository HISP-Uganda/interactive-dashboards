import { Button, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import React, { ChangeEvent } from "react";
import { reportApi } from "../../Events";
import { IReport, LocationGenerics, Option } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $report, $settings, $store } from "../../Store";
import { CheckboxField, SelectField } from "../fields";

export default function Report() {
    const navigate = useNavigate<LocationGenerics>();
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const search = useSearch<LocationGenerics>();

    const store = useStore($store);
    const report = useStore($report);

    const saveReport = async () => {
        await saveDocument(
            storage,
            "i-reports",
            store.systemId,
            report,
            engine,
            search.action || "create"
        );
        navigate({
            to: `/settings/reports/${report.id}/design`,
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
            <CheckboxField<IReport>
                attribute="isLandscape"
                obj={report}
                title="Landscape"
                func={reportApi.update}
            />
            <Stack direction="row" alignSelf="flex-end">
                <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                        navigate({ to: "/settings/reports", search: {} });
                    }}
                    key="btn1"
                >
                    Cancel
                </Button>

                <Button onClick={() => saveReport()} key="btn2">
                    Save Report
                </Button>
            </Stack>
        </Stack>
    );
}

import {
    Button,
    Grid,
    GridItem,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate } from "@tanstack/react-location";
import { Collapse, InputNumber, Modal } from "antd";
import { useStore } from "effector-react";
import { isArray } from "lodash";
import React from "react";
import { pageApi, reportApi } from "../../Events";
import {
    DataNode,
    IDashboard,
    ISection,
    IVisualization,
    LocationGenerics,
} from "../../interfaces";
import { saveDocument } from "../../Queries";
import {
    $isOpen,
    $page,
    $report,
    $settings,
    $store,
    isOpenApi,
} from "../../Store";
import { setBody } from "../../utils/utils";
import DashboardTreeCheck from "../DashboardTreeCheck";
import FixedDashboard from "../FixedDashboard";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";
// import "./dashboard-report.css";

const { Panel } = Collapse;
export default function ReportDesign() {
    const toast = useToast();
    const navigate = useNavigate<LocationGenerics>();
    const { storage } = useStore($settings);
    const engine = useDataEngine();
    const store = useStore($store);
    const page = useStore($page);
    const report = useStore($report);
    const isOpen = useStore($isOpen);
    setBody(report.size, report.isLandscape);

    const onChange = (items: DataNode[]) => {
        pageApi.update({ attribute: "items", value: items });
    };

    const onExpand = (key: string | string[]) => {
        const finalKey = isArray(key) ? key[0] : key;
        const page = report.pages.find((p) => p.id === finalKey);

        if (page) {
            pageApi.set(page);
        }
    };

    const addItem = () => {
        pageApi.reset();
        isOpenApi.onOpen();
    };
    const onApply = () => {
        isOpenApi.onClose();
        if (page) {
            reportApi.addPage(page);
        }
    };

    const saveReport = async () => {
        await saveDocument(
            storage,
            "i-reports",
            store.systemId,
            report,
            engine,
            "update"
        );
        toast({
            title: "Report",
            description: "Report saved successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    };

    const view = () => {
        navigate({
            to: `/reports/${report.id}`,
        });
    };

    const cancel = () => {
        navigate({
            to: `/settings/reports`,
        });
    };
    const updateMetadata = ({
        page,
        item,
        metadata,
    }: {
        page: string;
        item: string;
        metadata: Partial<{
            rows: number;
            columns: number;
            rowsPerPage: number;
        }>;
    }) => {
        reportApi.updateReportItem({ page, item, metadata });
        pageApi.updateItem({ item, metadata });
    };

    const updatePage = () => {
        isOpenApi.onOpen();
    };
    return (
        <Stack direction="row" w="100%" h="100%">
            <Stack
                w="calc(100vw - 400px - 340px)"
                h="calc(100vh - 48px - 160px)"
                overflow="auto"
                p="5px"
            >
                {page && report.pages.find((p) => p.id === page.id) && (
                    <Stack className="sheet padding-10mm">
                        <Grid
                            w="100%"
                            h="100%"
                            templateRows="repeat(24, 1fr)"
                            templateColumns="repeat(24, 1fr)"
                        >
                            {page.items.map((item) => {
                                if (item.type === "dashboard") {
                                    return (
                                        <GridItem
                                            w="100%"
                                            h="100%"
                                            colSpan={
                                                item.metadata?.columns || 24
                                            }
                                            rowSpan={item.metadata?.rows || 24}
                                        >
                                            <Stack
                                                p={`${item.nodeSource?.spacing}px`}
                                                key={item.id}
                                                w="100%"
                                                h="100%"
                                            >
                                                <FixedDashboard
                                                    dashboard={
                                                        item.nodeSource as IDashboard
                                                    }
                                                />
                                            </Stack>
                                        </GridItem>
                                    );
                                } else if (item.type === "section") {
                                    return (
                                        <GridItem
                                            w="100%"
                                            h="100%"
                                            colSpan={
                                                item.metadata?.columns || 24
                                            }
                                            rowSpan={item.metadata?.rows || 24}
                                        >
                                            <Stack w="100%" height="100%">
                                                <SectionVisualization
                                                    section={{
                                                        ...(item.nodeSource as ISection),
                                                    }}
                                                />
                                            </Stack>
                                        </GridItem>
                                    );
                                } else if (item.type === "visualization") {
                                    return (
                                        <GridItem
                                            w="100%"
                                            h="100%"
                                            colSpan={
                                                item.metadata?.columns || 24
                                            }
                                            rowSpan={item.metadata?.rows || 24}
                                        >
                                            <Stack
                                                w="100%"
                                                key={item.id}
                                                h="100%"
                                            >
                                                <Visualization
                                                    visualization={
                                                        item.nodeSource as IVisualization
                                                    }
                                                    section={
                                                        item.parent as ISection
                                                    }
                                                />
                                            </Stack>
                                        </GridItem>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </Grid>
                    </Stack>
                )}
            </Stack>
            <Stack w="400px" h="100%">
                <Stack w="100%" h="100%">
                    <Collapse
                        activeKey={page?.id}
                        onChange={onExpand}
                        accordion
                    >
                        {report.pages.map((page) => (
                            <Panel header={page.id} key={page.id}>
                                <Stack>
                                    <Button onClick={() => updatePage()}>
                                        Edit
                                    </Button>

                                    <Collapse accordion>
                                        {page.items.map((i) => (
                                            <Panel
                                                header={String(i.title)}
                                                key={String(i.id || i.value)}
                                            >
                                                <Stack w="100%">
                                                    <Stack>
                                                        <Text>
                                                            Rows Per Page
                                                        </Text>
                                                        <InputNumber
                                                            onChange={(value) =>
                                                                updateMetadata({
                                                                    page: page.id,
                                                                    item: String(
                                                                        i.key
                                                                    ),
                                                                    metadata:
                                                                        value
                                                                            ? {
                                                                                  rowsPerPage:
                                                                                      value,
                                                                              }
                                                                            : {},
                                                                })
                                                            }
                                                            min={1}
                                                            value={
                                                                i.metadata
                                                                    ?.rowsPerPage
                                                            }
                                                        />
                                                    </Stack>
                                                    <Stack>
                                                        <Text>Grid Rows</Text>
                                                        <InputNumber
                                                            onChange={(value) =>
                                                                updateMetadata({
                                                                    page: page.id,
                                                                    item: String(
                                                                        i.key
                                                                    ),
                                                                    metadata:
                                                                        value
                                                                            ? {
                                                                                  rows: value,
                                                                              }
                                                                            : {},
                                                                })
                                                            }
                                                            min={1}
                                                            max={24}
                                                            value={
                                                                i.metadata?.rows
                                                            }
                                                        />
                                                    </Stack>
                                                    <Stack>
                                                        <Text>
                                                            Grid Columns
                                                        </Text>
                                                        <InputNumber
                                                            min={1}
                                                            max={24}
                                                            value={
                                                                i.metadata
                                                                    ?.columns
                                                            }
                                                            onChange={(value) =>
                                                                updateMetadata({
                                                                    page: page.id,
                                                                    item: String(
                                                                        i.key
                                                                    ),
                                                                    metadata:
                                                                        value
                                                                            ? {
                                                                                  columns:
                                                                                      value,
                                                                              }
                                                                            : {},
                                                                })
                                                            }
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </Stack>
                            </Panel>
                        ))}
                    </Collapse>

                    <Stack direction="row">
                        <Button onClick={() => addItem()}>Add Page</Button>
                        <Button onClick={() => saveReport()}>
                            Save Report
                        </Button>
                    </Stack>

                    <Stack direction="row">
                        <Button onClick={() => view()}>Preview</Button>
                        <Button onClick={() => cancel()}>OK</Button>
                    </Stack>
                </Stack>
            </Stack>

            <Modal
                centered
                width="500px"
                mask={false}
                open={isOpen}
                title="Page Items"
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
                    height: "auto",
                }}
            >
                <Stack>
                    <Text>Items</Text>
                    <DashboardTreeCheck
                        value={page?.items?.map((i) => i.key) || []}
                        onChange={onChange}
                    />
                </Stack>
            </Modal>
        </Stack>
    );
}

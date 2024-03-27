import {
    Box,
    Button,
    Checkbox,
    Heading,
    Input,
    Spacer,
    Stack,
    Switch,
    Table,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    SimpleGrid,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { dataSourcesApi, datumAPi } from "../../Events";
import { IData, IDataSource, LocationGenerics, Option } from "../../interfaces";
import { saveDocument } from "../../Queries";
import {
    $currentDataSource,
    $settings,
    $store,
    $visualizationQuery,
} from "../../Store";
import {
    flatteningOptions,
    getSearchParams,
    globalIds,
} from "../../utils/utils";
import { generalPadding, otherHeight } from "../constants";
import { DisplayDataSourceType } from "../data-sources";
import NamespaceDropdown from "../NamespaceDropdown";
import { useQueryClient } from "@tanstack/react-query";

const availableOptions: Option[] = [
    { value: "SQL_VIEW", label: "SQL Views" },
    { value: "ANALYTICS", label: "Analytics" },
    { value: "API", label: "API" },
    { value: "VISUALIZATION", label: "DHIS2 Visualizations" },
];
export default function VisualizationQuery() {
    const search = useSearch<LocationGenerics>();
    const store = useStore($store);
    const navigate = useNavigate<LocationGenerics>();
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const visualizationQuery = useStore($visualizationQuery);
    const currentDataSource = useStore($currentDataSource);
    const queryClient = useQueryClient();

    const onSave = async () => {
        await saveDocument<IData>(
            storage,
            "i-visualization-queries",
            store.systemId,
            visualizationQuery,
            engine,
            search.action || "create"
        );

        queryClient.setQueryData<IData[]>(
            ["i-visualization-queries"],
            (old) => {
                if (old) {
                    return [...old, visualizationQuery];
                }
                return [visualizationQuery];
            }
        );
        navigate({
            to: `/settings/visualization-queries`,
            search: { action: "update" },
        });
    };

    return (
        <Stack
            p={`${generalPadding}px`}
            h={otherHeight}
            maxH={otherHeight}
            w="100%"
            overflow="auto"
            bgColor="white"
            spacing="30px"
        >
            <Stack>
                <Text>Name</Text>
                <Input
                    value={visualizationQuery.name || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        datumAPi.changeAttribute({
                            attribute: "name",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <Stack>
                <Text>Description</Text>
                <Textarea
                    value={visualizationQuery.description || ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        datumAPi.changeAttribute({
                            attribute: "description",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <Stack direction="row" spacing="40px">
                <Stack direction="row" alignItems="center" flex={1}>
                    <Text>Data Source</Text>
                    <Box flex={1}>
                        <NamespaceDropdown<IDataSource>
                            namespace="i-data-sources"
                            value={visualizationQuery.dataSource}
                            onChange={(value) => {
                                datumAPi.changeAttribute({
                                    attribute: "dataSource",
                                    value: value?.id,
                                });
                            }}
                            callback={(value: IDataSource[]) =>
                                dataSourcesApi.setDataSources(value)
                            }
                        />
                    </Box>
                </Stack>
                {currentDataSource?.type === "DHIS2" && (
                    <Stack direction="row" alignItems="center" flex={1}>
                        <Text>Type</Text>
                        <Box flex={1}>
                            <Select<Option, false, GroupBase<Option>>
                                value={availableOptions.find(
                                    (pt) => pt.value === visualizationQuery.type
                                )}
                                onChange={(e) =>
                                    datumAPi.changeAttribute({
                                        attribute: "type",
                                        value: e?.value,
                                    })
                                }
                                options={availableOptions}
                                isClearable
                            />
                        </Box>
                    </Stack>
                )}
            </Stack>
            <Box>
                <DisplayDataSourceType dataSource={currentDataSource} />
            </Box>
            {visualizationQuery.type === "SQL_VIEW" && (
                <Table size="sm" textTransform="none">
                    <Thead>
                        <Tr py={1}>
                            <Th w="50%">
                                <Heading as="h6" size="xs" textTransform="none">
                                    Key
                                </Heading>
                            </Th>
                            <Th w="200px" textAlign="center">
                                <Heading as="h6" size="xs" textTransform="none">
                                    Use Global Filter
                                </Heading>
                            </Th>
                            <Th>
                                <Heading as="h6" size="xs" textTransform="none">
                                    Value
                                </Heading>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody py={10}>
                        {getSearchParams(visualizationQuery.query).map(
                            (record) => (
                                <Tr key={record}>
                                    <Td>
                                        <Input readOnly value={record} />
                                    </Td>
                                    <Td textAlign="center">
                                        <Checkbox
                                            isChecked={
                                                visualizationQuery
                                                    ?.expressions?.[record]
                                                    ?.isGlobal
                                            }
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                datumAPi.changeExpressionValue({
                                                    attribute: record,
                                                    value: "",
                                                    isGlobal: e.target.checked,
                                                })
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        {visualizationQuery?.expressions?.[
                                            record
                                        ]?.isGlobal ? (
                                            <Select<
                                                Option,
                                                false,
                                                GroupBase<Option>
                                            >
                                                value={globalIds.find(
                                                    (pt) =>
                                                        pt.value ===
                                                        visualizationQuery
                                                            ?.expressions?.[
                                                            record
                                                        ]?.value
                                                )}
                                                onChange={(e) =>
                                                    datumAPi.changeExpressionValue(
                                                        {
                                                            attribute: record,
                                                            value:
                                                                e?.value || "",
                                                            isGlobal: true,
                                                        }
                                                    )
                                                }
                                                options={globalIds}
                                                isClearable
                                            />
                                        ) : (
                                            <Input
                                                value={
                                                    visualizationQuery
                                                        ?.expressions?.[record]
                                                        ?.value || "NULL"
                                                }
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    datumAPi.changeExpressionValue(
                                                        {
                                                            attribute: record,
                                                            value: e.target
                                                                .value,
                                                            isGlobal: false,
                                                        }
                                                    )
                                                }
                                            />
                                        )}
                                    </Td>
                                </Tr>
                            )
                        )}
                    </Tbody>
                </Table>
            )}

            {!(
                currentDataSource?.type === "DHIS2" &&
                visualizationQuery.type === "VISUALIZATION"
            ) && (
                <SimpleGrid spacing="30px" columns={2}>
                    <Stack flex={1} direction="row" alignItems="center">
                        <Text>Flattening Option</Text>
                        <Box flex={1}>
                            <Select<Option, false, GroupBase<Option>>
                                value={flatteningOptions.find(
                                    (pt) =>
                                        pt.value ===
                                        visualizationQuery.flatteningOption
                                )}
                                onChange={(e) =>
                                    datumAPi.changeAttribute({
                                        attribute: "flatteningOption",
                                        value: e?.value,
                                    })
                                }
                                options={flatteningOptions}
                                isClearable
                            />
                        </Box>
                    </Stack>
                    <Stack direction="row" flex={1} alignItems="center">
                        <Text>Join To</Text>
                        <Box flex={1}>
                            <NamespaceDropdown<IData>
                                namespace="i-visualization-queries"
                                value={visualizationQuery.joinTo}
                                onChange={(value) =>
                                    datumAPi.changeAttribute({
                                        attribute: "joinTo",
                                        value: value?.id,
                                    })
                                }
                            />
                        </Box>
                    </Stack>

                    <Stack direction="row" flex={1} alignItems="center">
                        <Text>To Column</Text>
                        <Input
                            flex={1}
                            value={visualizationQuery.toColumn}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                datumAPi.changeAttribute({
                                    attribute: "toColumn",
                                    value: e.target.value,
                                })
                            }
                        />
                    </Stack>

                    <Stack direction="row" flex={1} alignItems="center">
                        <Text>From Column</Text>
                        <Input
                            flex={1}
                            value={visualizationQuery.fromColumn}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                datumAPi.changeAttribute({
                                    attribute: "fromColumn",
                                    value: e.target.value,
                                })
                            }
                        />
                    </Stack>

                    <Stack direction="row">
                        <Text>Start With from</Text>
                        <Switch
                            isChecked={visualizationQuery.fromFirst}
                            onChange={(e) =>
                                datumAPi.changeAttribute({
                                    attribute: "fromFirst",
                                    value: e.target.checked,
                                })
                            }
                        />
                    </Stack>
                    <Stack direction="row">
                        <Text>Include Empty</Text>
                        <Switch
                            isChecked={visualizationQuery.includeEmpty}
                            onChange={(e) =>
                                datumAPi.changeAttribute({
                                    attribute: "includeEmpty",
                                    value: e.target.checked,
                                })
                            }
                        />
                    </Stack>

                    <Stack direction="row" flex={1} alignItems="center">
                        <Text>Value if Empty</Text>
                        <Input
                            flex={1}
                            value={visualizationQuery.valueIfEmpty}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                datumAPi.changeAttribute({
                                    attribute: "valueIfEmpty",
                                    value: e.target.value,
                                })
                            }
                        />
                    </Stack>
                </SimpleGrid>
            )}

            <Stack direction="row">
                <Spacer />
                <Button onClick={() => onSave()}>OK</Button>
            </Stack>
        </Stack>
    );
}

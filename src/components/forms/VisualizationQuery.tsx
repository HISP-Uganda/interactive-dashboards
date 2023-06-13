import {
    Button,
    Checkbox,
    Heading,
    Input,
    Spacer,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    Box,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { datumAPi } from "../../Events";
import { IData, IDataSource, LocationGenerics, Option } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $settings, $store, $visualizationQuery } from "../../Store";
import { getSearchParams, globalIds } from "../../utils/utils";
import { generalPadding, otherHeight } from "../constants";
import { DisplayDataSourceType } from "../data-sources";
import NamespaceDropdown from "../NamespaceDropdown";

const availableOptions: Option[] = [
    { value: "SQL_VIEW", label: "SQL Views" },
    { value: "ANALYTICS", label: "Analytics" },
    { value: "API", label: "API" },
];
export default function VisualizationQuery() {
    const search = useSearch<LocationGenerics>();
    const store = useStore($store);
    const navigate = useNavigate<LocationGenerics>();
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const visualizationQuery = useStore($visualizationQuery);
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
                            onChange={(value) =>
                                datumAPi.changeAttribute({
                                    attribute: "dataSource",
                                    value,
                                })
                            }
                        />
                    </Box>
                </Stack>
                {visualizationQuery.dataSource?.type === "DHIS2" && (
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
                <DisplayDataSourceType />
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
                                        <Text>{record}</Text>
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

            <Stack direction="row" alignItems="center" spacing="50px">
                <Stack direction="row" flex={1} alignItems="center">
                    <Text>Join To</Text>
                    <Box flex={1}>
                        <NamespaceDropdown<IData>
                            namespace="i-visualization-queries"
                            value={visualizationQuery.joinTo}
                            onChange={(value) =>
                                datumAPi.changeAttribute({
                                    attribute: "joinTo",
                                    value,
                                })
                            }
                        />
                    </Box>
                </Stack>

                {/* <Stack direction="row" flex={1} alignItems="center">
                    <Text>Join To Column</Text>
                    <Input
                        flex={1}
                        value={visualizationQuery.joinToColumn}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            datumAPi.changeAttribute({
                                attribute: "joinToColumn",
                                value: e.target.value,
                            })
                        }
                    />
                </Stack>

                <Stack direction="row" flex={1} alignItems="center">
                    <Text>Join Column</Text>
                    <Input
                        flex={1}
                        value={visualizationQuery.joinColumn}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            datumAPi.changeAttribute({
                                attribute: "joinColumn",
                                value: e.target.value,
                            })
                        }
                    />
                </Stack> */}
            </Stack>
            <Stack direction="row">
                <Spacer />
                <Button
                    onClick={async () => {
                        await saveDocument<IData>(
                            storage,
                            "i-visualization-queries",
                            store.systemId,
                            visualizationQuery,
                            engine,
                            search.action || "create"
                        );
                        navigate({
                            to: `/settings/visualization-queries`,
                            search: { action: "update" },
                        });
                    }}
                >
                    OK
                </Button>
            </Stack>
        </Stack>
    );
}

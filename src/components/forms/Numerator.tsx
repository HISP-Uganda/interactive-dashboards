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
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";

import {
    changeNumeratorAttribute,
    changeNumeratorDimension,
    changeNumeratorExpressionValue,
} from "../../Events";
import { Option, LocationGenerics } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $dataSourceType, $indicator, $store, $settings } from "../../Store";
import { getSearchParams, globalIds } from "../../utils/utils";
import { generalPadding, otherHeight } from "../constants";
import { displayDataSourceType } from "../data-sources";
import { useDataEngine } from "@dhis2/app-runtime";

const availableOptions: Option[] = [
    { value: "SQL_VIEW", label: "SQL Views" },
    { value: "ANALYTICS", label: "Analytics" },
];
const Numerator = () => {
    const indicator = useStore($indicator);
    const search = useSearch<LocationGenerics>();
    const dataSourceType = useStore($dataSourceType);
    const store = useStore($store);
    const navigate = useNavigate<LocationGenerics>();
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    return (
        <Stack
            p={`${generalPadding}px`}
            h={otherHeight}
            maxH={otherHeight}
            w="100%"
            overflow="auto"
            bgColor="white"
        >
            <Stack>
                <Text>Numerator Name</Text>
                <Input
                    value={indicator.numerator?.name || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeNumeratorAttribute({
                            attribute: "name",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            <Stack>
                <Text>Numerator Description</Text>
                <Textarea
                    value={indicator.numerator?.description || ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        changeNumeratorAttribute({
                            attribute: "description",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
            {dataSourceType === "DHIS2" && (
                <Stack>
                    <Text>Type</Text>
                    <Select<Option, false, GroupBase<Option>>
                        value={availableOptions.find(
                            (pt) => pt.value === indicator.numerator?.type
                        )}
                        onChange={(e) =>
                            changeNumeratorAttribute({
                                attribute: "resource",
                                value: e?.value,
                            })
                        }
                        options={availableOptions}
                        isClearable
                    />
                </Stack>
            )}

            {displayDataSourceType({
                dataSourceType,
                onChange: changeNumeratorDimension,
                denNum: indicator.numerator,
                changeQuery: changeNumeratorAttribute,
            })}

            {indicator.numerator?.type === "SQL_VIEW" && (
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
                        {getSearchParams(indicator.numerator.query).map(
                            (record) => (
                                <Tr key={record}>
                                    <Td>
                                        <Text>{record}</Text>
                                        <Input readOnly value={record} />
                                    </Td>
                                    <Td textAlign="center">
                                        <Checkbox
                                            isChecked={
                                                indicator.numerator
                                                    ?.expressions?.[record]
                                                    ?.isGlobal
                                            }
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                changeNumeratorExpressionValue({
                                                    attribute: record,
                                                    value: "",
                                                    isGlobal: e.target.checked,
                                                })
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        {indicator.numerator?.expressions?.[
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
                                                        indicator.numerator
                                                            ?.expressions?.[
                                                            record
                                                        ]?.value
                                                )}
                                                onChange={(e) =>
                                                    changeNumeratorExpressionValue(
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
                                                    indicator.numerator
                                                        ?.expressions?.[record]
                                                        ?.value || "NULL"
                                                }
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    changeNumeratorExpressionValue(
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
            <Stack direction="row">
                <Spacer />
                <Button
                    onClick={async () => {
                        await saveDocument(
                            storage,
                            "i-visualization-queries",
                            store.systemId,
                            indicator,
                            engine,
                            search.action || "create"
                        );
                        navigate({
                            to: `/settings/indicators/${indicator.id}`,
                            search: { action: "update" },
                        });
                    }}
                >
                    OK
                </Button>
            </Stack>
        </Stack>
    );
};

export default Numerator;

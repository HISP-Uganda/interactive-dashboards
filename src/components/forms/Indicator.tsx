import {
    Box,
    Button,
    Checkbox,
    Input,
    Spacer,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import {
    changeIndicatorAttribute,
    changeNumeratorDimension,
    changeUseIndicators,
    setIndicator,
} from "../../Events";
import { LocationGenerics } from "../../interfaces";
import { saveDocument } from "../../Queries";
import {
    $dataSourceType,
    $hasDHIS2,
    $indicator,
    $settings,
    $store,
    createIndicator,
} from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import { displayDataSourceType } from "../data-sources";
import NamespaceSelect from "../NamespaceSelect";

const Indicator = () => {
    const search = useSearch<LocationGenerics>();
    const indicator = useStore($indicator);
    const store = useStore($store);
    const hasDHIS2 = useStore($hasDHIS2);
    const dataSourceType = useStore($dataSourceType);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const [loading, setLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const add = async () => {
        setLoading(true);
        await saveDocument(
            storage,
            "i-visualization-queries",
            store.systemId,
            indicator,
            engine,
            search.action || "create"
        );
        await queryClient.invalidateQueries(["visualization-queries"]);
        setLoading(false);
        navigate({ to: "/settings/indicators" });
    };
    return (
        <Box
            p={`${generalPadding}px`}
            bgColor="white"
            flex={1}
            h={otherHeight}
            maxH={otherHeight}
            w="100%"
        >
            <Stack spacing="20px">
                <Stack>
                    <Text>Data Source</Text>
                    <NamespaceSelect />
                </Stack>
                {hasDHIS2 && (
                    <Checkbox
                        isChecked={indicator.useInBuildIndicators}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            changeUseIndicators(e.target.checked)
                        }
                    >
                        Use DHIS2 Indicators
                    </Checkbox>
                )}
                <Stack>
                    <Text>Name</Text>
                    <Input
                        value={indicator.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            changeIndicatorAttribute({
                                attribute: "name",
                                value: e.target.value,
                            })
                        }
                    />
                </Stack>
                {indicator.useInBuildIndicators ? (
                    <Stack>
                        {displayDataSourceType({
                            dataSourceType,
                            onChange: changeNumeratorDimension,
                            denNum: indicator.numerator,
                        })}
                    </Stack>
                ) : (
                    <>
                        <Stack>
                            <Text>Description</Text>
                            <Textarea
                                value={indicator.description}
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                    changeIndicatorAttribute({
                                        attribute: "description",
                                        value: e.target.value,
                                    })
                                }
                            />
                        </Stack>

                        <Checkbox
                            isChecked={indicator.custom}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                changeIndicatorAttribute({
                                    attribute: "custom",
                                    value: e.target.checked,
                                })
                            }
                        >
                            Custom calculations (x is numerator and y is
                            denominator)
                        </Checkbox>
                        <Stack>
                            <Text>Expression</Text>
                            <Textarea
                                value={indicator.factor}
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                    changeIndicatorAttribute({
                                        attribute: "factor",
                                        value: e.target.value,
                                    })
                                }
                            />
                        </Stack>

                        {dataSourceType === "ELASTICSEARCH" && (
                            <Stack>
                                <Text>Query</Text>
                                <Textarea
                                    rows={20}
                                    value={indicator.query}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                        changeIndicatorAttribute({
                                            attribute: "query",
                                            value: e.target.value,
                                        })
                                    }
                                />
                            </Stack>
                        )}
                        {dataSourceType !== "ELASTICSEARCH" && (
                            <Stack direction="row" spacing="50px">
                                <Button
                                    onClick={() => {
                                        navigate({
                                            to: `/settings/indicators/${indicator.id}/numerator`,
                                            search,
                                        });
                                    }}
                                >
                                    Numerator
                                </Button>
                                <Button
                                    onClick={() =>
                                        navigate({
                                            to: `/settings/indicators/${indicator.id}/denominator`,
                                            search,
                                        })
                                    }
                                >
                                    Denominator
                                </Button>
                            </Stack>
                        )}
                    </>
                )}
                <pre>{JSON.stringify(indicator, null, 2)}</pre>
                <Stack direction="row">
                    <Button
                        colorScheme="red"
                        onClick={() => {
                            setIndicator(createIndicator());
                            navigate({ to: "/settings/indicators", search });
                        }}
                    >
                        Cancel
                    </Button>
                    <Spacer />
                    <Button onClick={() => add()} isLoading={loading}>
                        Save Visualization Data
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Indicator;

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
import { indicatorApi } from "../../Events";
import { IData, LocationGenerics } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $indicator, $settings, $store, createIndicator } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import NamespaceDropdown from "../NamespaceDropdown";

export default function Indicator() {
    const search = useSearch<LocationGenerics>();
    const indicator = useStore($indicator);
    const store = useStore($store);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const [loading, setLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const add = async () => {
        setLoading(true);
        await saveDocument(
            storage,
            "i-indicators",
            store.systemId,
            indicator,
            engine,
            search.action || "create"
        );
        await queryClient.invalidateQueries(["i-indicators"]);
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
            <Stack spacing="30px">
                <Stack>
                    <Text>Name</Text>
                    <Input
                        value={indicator.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            indicatorApi.changeIndicatorAttribute({
                                attribute: "name",
                                value: e.target.value,
                            })
                        }
                    />
                </Stack>

                <Stack>
                    <Text>Description</Text>
                    <Textarea
                        value={indicator.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            indicatorApi.changeIndicatorAttribute({
                                attribute: "description",
                                value: e.target.value,
                            })
                        }
                    />
                </Stack>

                <Checkbox
                    isChecked={indicator.custom}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        indicatorApi.changeIndicatorAttribute({
                            attribute: "custom",
                            value: e.target.checked,
                        })
                    }
                >
                    Custom calculations (x is numerator and y is denominator)
                </Checkbox>
                <Stack>
                    <Text>Expression</Text>
                    <Textarea
                        value={indicator.factor}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            indicatorApi.changeIndicatorAttribute({
                                attribute: "factor",
                                value: e.target.value,
                            })
                        }
                    />
                </Stack>

                <Stack>
                    <Text>Numerator</Text>
                    <NamespaceDropdown<IData>
                        namespace="i-visualization-queries"
                        value={indicator.numerator}
                        onChange={(value) =>
                            indicatorApi.changeIndicatorAttribute({
                                attribute: "numerator",
                                value,
                            })
                        }
                    />
                </Stack>

                <Stack>
                    <Text>Denominator</Text>
                    <NamespaceDropdown<IData>
                        namespace="i-visualization-queries"
                        value={indicator.denominator}
                        onChange={(value) =>
                            indicatorApi.changeIndicatorAttribute({
                                attribute: "denominator",
                                value,
                            })
                        }
                    />
                </Stack>
                <Stack direction="row">
                    <Button
                        colorScheme="red"
                        onClick={() => {
                            indicatorApi.setIndicator(createIndicator());
                            navigate({ to: "/settings/indicators", search });
                        }}
                    >
                        Cancel
                    </Button>
                    <Spacer />
                    <Button onClick={() => add()} isLoading={loading}>
                        Save Indicator
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

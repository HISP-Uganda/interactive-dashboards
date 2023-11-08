import React from "react";
import { INamed, AttributeProps, ICategory } from "../../interfaces";
import { Stack, Text, StackProps, Box } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { $store, $settings } from "../../Store";
import { useNamespace } from "../../Queries";
import LoadingIndicator from "../LoadingIndicator";

export default function ResourceField<T, U extends INamed>({
    title,
    func,
    obj,
    multiple,
    attribute,
    resource,
    ...rest
}: AttributeProps<T> & {
    multiple: boolean | undefined;
    resource: string;
} & StackProps) {
    const { systemId } = useStore($store);
    const { storage } = useStore($settings);
    const { isLoading, isSuccess, isError, error, data } = useNamespace<U>(
        resource,
        storage,
        systemId,
        []
    );
    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (isError) {
        return <Text>{error?.message}</Text>;
    }

    if (isSuccess && data) {
        return (
            <Stack {...rest}>
                <Text>{title}</Text>
                {multiple ? (
                    <Box
                        flex={
                            rest.direction && rest.direction === "row"
                                ? 1
                                : undefined
                        }
                    >
                        <Select<U, true, GroupBase<U>>
                            isMulti
                            value={data.filter(
                                (pt) =>
                                    String(obj[attribute])
                                        .split(",")
                                        .indexOf(String(pt.id)) !== -1
                            )}
                            onChange={(e) =>
                                func({
                                    attribute,
                                    value: e
                                        .map((ex) => String(ex.id))
                                        .join(","),
                                })
                            }
                            options={data}
                            isClearable
                            menuPlacement="auto"
                            getOptionValue={() => "id"}
                            getOptionLabel={() => "name"}
                        />
                    </Box>
                ) : (
                    <Box
                        flex={
                            rest.direction && rest.direction === "row"
                                ? 1
                                : undefined
                        }
                    >
                        <Select<U, false, GroupBase<U>>
                            value={data.find(
                                (pt) => pt.id === String(obj[attribute])
                            )}
                            onChange={(e) =>
                                func({
                                    attribute,
                                    value: e?.id,
                                })
                            }
                            options={data}
                            isClearable
                            menuPlacement="auto"
                            getOptionValue={(val) => val.id}
                            getOptionLabel={(val) => String(val.name)}
                            size="sm"
                        />
                    </Box>
                )}
            </Stack>
        );
    }
    return null;
}

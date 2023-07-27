import { Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import React from "react";
import { ChartProps, LocationGenerics } from "../../interfaces";
import { useOptionSet } from "../../Queries";
import LoadingIndicator from "../LoadingIndicator";

export default function OptionSet({ visualization }: ChartProps) {
    const navigate = useNavigate<LocationGenerics>();

    const { isLoading, isError, error, isSuccess, data } = useOptionSet(
        visualization.properties["optionSet"]
    );
    const affected = visualization.properties["affected"] || "";
    const onClick = (code: string) => {
        navigate({
            search: (old) => ({ ...old, optionSet: code, affected }),
            replace: true,
        });
    };
    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && data && (
                <Stack padding="5px">
                    {data.map(({ code, name }) => (
                        <Text
                            key={code}
                            onClick={() => onClick(code)}
                            cursor="pointer"
                        >
                            {name}
                        </Text>
                    ))}
                </Stack>
            )}
            {isError && <Text>{JSON.stringify(error)}</Text>}
        </>
    );
}

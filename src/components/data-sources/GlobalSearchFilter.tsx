import { Input, Stack } from "@chakra-ui/react";
import { Event } from "effector";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Dimension, IData } from "../../interfaces";
import GlobalAndFilter from "./GlobalAndFilter";
import { useStore } from "effector-react";
import { $visualizationQuery } from "../../Store";

type GlobalSearchFilterProps = {
    useGlobal: boolean;
    setQ: (value: string) => void;
    setType: Dispatch<SetStateAction<"filter" | "dimension">>;
    setUseGlobal: Dispatch<SetStateAction<boolean>>;
    q: string;
    type: "filter" | "dimension";
    dimension: string;
    id: string;
    resource: string;
    prefix?: string;
    suffix?: string;
};

export default function GlobalSearchFilter({
    useGlobal,
    q,
    setQ,
    setUseGlobal,
    setType,
    dimension,
    resource,
    type,
    id,
    prefix,
    suffix,
}: GlobalSearchFilterProps) {
    const visualizationQuery = useStore($visualizationQuery);
    return (
        <Stack direction="row" w="100%" flex={1} alignItems="center">
            <GlobalAndFilter
                dimension={dimension}
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                type={type}
                resource={resource}
                id={id}
                prefix={prefix}
                suffix={suffix}
            />
            {!useGlobal && (
                <Input
                    w="500px"
                    value={q}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setQ(e.target.value)
                    }
                />
            )}
        </Stack>
    );
}

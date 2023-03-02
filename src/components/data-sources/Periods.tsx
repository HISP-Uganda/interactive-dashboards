import { Stack } from "@chakra-ui/react";
import { PeriodDimension } from "@dhis2/analytics";
import React, { useState } from "react";
import { IndicatorProps } from "../../interfaces";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import GlobalSearchFilter from "./GlobalSearchFilter";

const Periods = ({ denNum, onChange }: IndicatorProps) => {
    const { previousType, isGlobal, selected } = computeGlobalParams(
        denNum,
        "pe",
        "m5D13FqKZwN"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    const [q, setQ] = useState<string>("");

    return (
        <Stack spacing="20px">
            <GlobalSearchFilter
                denNum={denNum}
                dimension="pe"
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="pe"
                type={type}
                onChange={onChange}
                setQ={setQ}
                q={q}
                id={globalIds[0].value}
            />
            {!useGlobal && (
                <PeriodDimension
                    onSelect={({ items }: any) => {
                        items.forEach(({ id, name, ...others }: any) => {
                            onChange({
                                id,
                                type,
                                dimension: "pe",
                                resource: "pe",
                                label: name,
                            });
                        });
                    }}
                    selectedPeriods={selected}
                />
            )}
        </Stack>
    );
};

export default Periods;

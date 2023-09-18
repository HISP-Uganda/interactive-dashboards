import { Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { datumAPi } from "../../Events";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import PeriodPicker from "../PeriodPicker";
import GlobalSearchFilter from "./GlobalSearchFilter";

const Periods = () => {
    const { previousType, isGlobal, selected } = computeGlobalParams(
        "pe",
        "m5D13FqKZwN"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    const [q, setQ] = useState<string>("");

    return (
        <Stack spacing="20px">
            <GlobalSearchFilter
                dimension="pe"
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="pe"
                type={type}
                setQ={setQ}
                q={q}
                id={globalIds[0].value}
            />
            {!useGlobal && (
                <Stack direction="row">
                    <PeriodPicker
                        selectedPeriods={selected}
                        onChange={(items, remove) =>
                            items.forEach(
                                ({ id, value, type: periodType, label }) => {
                                    datumAPi.changeDimension({
                                        id: value,
                                        type,
                                        dimension: "pe",
                                        resource: "pe",
                                        periodType,
                                        remove,
                                        label,
                                    });
                                }
                            )
                        }
                    />
                </Stack>
            )}
        </Stack>
    );
};

export default Periods;

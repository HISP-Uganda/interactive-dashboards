import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { IndicatorProps } from "../../interfaces";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OrgUnitTree = ({ denNum, onChange }: IndicatorProps) => {
    const [q, setQ] = useState<string>("");
    const { previousType, isGlobal } = computeGlobalParams(
        denNum,
        "ou",
        "mclvD0Z9mfT"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    console.log(globalIds[5].value);
    return (
        <Stack spacing="20px">
            <GlobalSearchFilter
                denNum={denNum}
                dimension="ou"
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="ou"
                type={type}
                onChange={onChange}
                setQ={setQ}
                q={q}
                id={globalIds[5].value}
            />
        </Stack>
    );
};

export default OrgUnitTree;
